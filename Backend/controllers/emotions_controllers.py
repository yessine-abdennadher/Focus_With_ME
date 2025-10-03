from fastapi import APIRouter, HTTPException
from models.Emotion import Emotion
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from config import MONGO_URI, MONGO_DB
from typing import List
from fastapi.responses import JSONResponse
from datetime import datetime

emotion_router = APIRouter()
client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB]

@emotion_router.post("/")
async def create_emotion(emotion: Emotion):
    if not emotion.timestamp:
        emotion.timestamp = datetime.utcnow()
    result = await db.emotions.insert_one(emotion.dict())
    return {"id": str(result.inserted_id)}


@emotion_router.get("/user/{user_id}", response_model=List[Emotion])
async def get_emotions_by_user_id(user_id: str):
    emotions_cursor = await db.emotions.find({"user_id": user_id}).to_list(100)
    
    if not emotions_cursor:
        raise HTTPException(status_code=404, detail="Aucune émotion trouvée pour cet utilisateur")

    emotions = []
    for em in emotions_cursor:
        em["id"] = str(em["_id"])
        del em["_id"]
        emotions.append(em)
    
    return emotions
@emotion_router.put("/{emotion_id}", response_model=dict)
async def update_emotion(emotion_id: str, emotion: Emotion):
    result = await db.emotions.update_one(
        {"_id": ObjectId(emotion_id)},
        {"$set": emotion.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Émotion non trouvée")
    return {"message": "Émotion mise à jour avec succès"}