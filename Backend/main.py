# ======================= Imports =======================
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from pathlib import Path
import numpy as np
import cv2
import asyncio

# Routers
from controllers.user_controller import user_router  
from controllers.categorie_controller import cat_router
from controllers.background_controller import vid_router
from controllers.motivation_controller import mot_router
from controllers.but_controller import but_router
from controllers.country_controller import pays_router
from controllers.emotions_controllers import emotion_router

# Utils
from utils import predict_fatigue

# Langchain Ollama (ChatBot)
from langchain_ollama import ChatOllama


from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.chat_history import InMemoryChatMessageHistory, BaseChatMessageHistory
from langchain_core.runnables import RunnableWithMessageHistory, RunnableLambda


# ======================= App Initialization =======================
app = FastAPI()

# CORS Configuration (pour autoriser Angular)
origins = ["http://localhost:4200"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================= Routers =======================
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(cat_router, prefix="/categories", tags=["categories"])
app.include_router(vid_router, prefix="/videos", tags=["videos"])
app.include_router(mot_router, prefix="/motivations", tags=["motivations"])
app.include_router(but_router, prefix="/buts", tags=["buts"])
app.include_router(pays_router, prefix="/pays", tags=["pays"])
app.include_router(emotion_router, prefix="/emotions")


# ======================= Root Endpoint =======================
@app.get("/")
async def root():
    return {"message": "FastAPI avec MongoDB 🚀"}


# ======================= Prédiction de Fatigue =======================
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    result = predict_fatigue(frame)
    return result


# ======================= ChatBot avec Langchain Ollama =======================

# 🔹 Chargement d'une ressource textuelle
RESOURCE_FILE_PATH = "resource.txt"
try:
    RESOURCE_CONTENT = Path(RESOURCE_FILE_PATH).read_text(encoding="utf-8")
except FileNotFoundError:
    RESOURCE_CONTENT = ""

# 🔹 Modèle de requête
class MessageRequest(BaseModel):
    message: str
    user_id: str

# 🔹 Historique des conversations utilisateur
user_histories: dict[str, BaseChatMessageHistory] = {}

# 🔹 Configuration du modèle LLM


# 🔹 Chaîne avec mémoire de session
chain = RunnableLambda(lambda x: llm.invoke(x["messages"]))
def get_user_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in user_histories:
        user_histories[session_id] = InMemoryChatMessageHistory()
    return user_histories[session_id]

chat_with_memory = RunnableWithMessageHistory(
    chain,
    get_user_history,
    input_messages_key="messages"
)

# Productivity system prompt to guide the assistant
PRODUCTIVITY_SYSTEM_PROMPT = """
You are a helpful productivity assistant.
- Answer briefly, using 1–3 sentences maximum.
- Use clear and concise language.
- Avoid repeating information.
- Only give one main suggestion or point per reply unless asked for more.
- Be encouraging and positive.

Reference this resource when relevant:
{RESOURCE_CONTENT}
"""
llm = ChatOllama(
    model="llama3.2:1b-instruct-fp16",
    temperature=0.7,
    max_tokens=50,  # Avant c'était 50, tu peux tester entre 50 et 100
    top_p=0.9,
    num_ctx=1024
)


# 🔹 Génération asynchrone de la réponse
async def generate_response(session_id: str, message: str):
    try:
        system_msg = SystemMessage(content=PRODUCTIVITY_SYSTEM_PROMPT)
        human_msg = HumanMessage(content=message)
        messages = [system_msg, human_msg]

        async for chunk in chat_with_memory.astream(
            {"messages": messages},
            config={"configurable": {"session_id": session_id}}
        ):
            if chunk.content:
                yield chunk.content
    except Exception as e:
        yield f"[Error]: {str(e)}"

# POST endpoint for chat messages
# 🔹 Endpoint de discussion
@app.post("/chat/")
async def chat(request: MessageRequest):
    return StreamingResponse(
        generate_response(request.user_id, request.message),
        media_type="text/plain"
    )