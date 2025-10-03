from fastapi import APIRouter, HTTPException
from models.user import User
from config import SECRET_KEY, MONGO_URI, MONGO_DB
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
import jwt
import datetime
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from typing import List, Optional

user_router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB]
def get_objectid(id: str):
    try:
        return ObjectId(id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")

@user_router.post("/register/")
async def register(user: User):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    hashed_password = pwd_context.hash(user.password)
    user_data = user.dict()
    user_data["password"] = hashed_password

    result = await db.users.insert_one(user_data)
    return {"id": str(result.inserted_id), "message": "Utilisateur créé avec succès"}

@user_router.post("/login/")
async def signin(user_data: dict):
    existing_user = await db.users.find_one({"email": user_data.get("email")})
    
    if not existing_user or not pwd_context.verify(user_data.get("password"), existing_user["password"]):
        raise HTTPException(status_code=400, detail="Email ou mot de passe incorrect")

    token = jwt.encode(
        {
            "user_id": str(existing_user["_id"]),
            "role": existing_user.get("role", "user"),
             "name": existing_user["name"], 
            "FamilyName": existing_user["FamilyName"], 
            "education": existing_user["education"], 
             "country": existing_user["country"], 
             "time_par_day": existing_user["time_par_day"],
              "rang": existing_user["rang"],
                 
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=4)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    return {"token": token,"user_id": str(existing_user["_id"]), "education":existing_user["education"],"country": existing_user["country"],"role": existing_user.get("role", "user"), "message": "Connexion réussie"}
@user_router.get("/", response_model=List[User])
async def get_users():
    users = await db.users.find().to_list(100)

    # Convertir _id en string et l'ajouter en tant que 'id'
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]  # Supprimer _id original si nécessaire

    return JSONResponse(status_code=200, content={"status_code": 200, "users": users})

@user_router.put("/{user_id}", response_model=dict)
async def update_user(user_id: str, user: User):
    user_data = user.dict()
    user_data.pop("id", None)  # Supprimer le champ 'id' s'il existe
    
    result = await db.users.update_one(
        {"_id": get_objectid(user_id)},
        {"$set": user_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User updated successfully"}

@user_router.delete("/{user_id}", response_model=dict)
async def delete_user(user_id: str):
    # Supprimer d'abord toutes les réservations associées à cet utilisateur

    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}


@user_router.get("/{user_id}", response_model=User)
async def get_user_by_id(user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    return user
@user_router.put("/{user_id}/education")
async def update_education(user_id: str, education_data: dict):
    # Vérifie que le champ education est présent
    if "education" not in education_data:
        raise HTTPException(status_code=400, detail="Le champ 'education' est requis")
    
    # Met à jour uniquement l'éducation
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"education": education_data["education"]}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé ou aucune modification")
    
    return {"message": "Éducation mise à jour avec succès"}
@user_router.put("/{user_id}/country")
async def update_country(user_id: str, country_data: dict):
    # Vérifie que le champ country est présent
    if "country" not in country_data:
        raise HTTPException(status_code=400, detail="Le champ 'country' est requis")
    
    # Met à jour uniquement l'éducation
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"country": country_data["country"]}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé ou aucune modification")
    
    return {"message": "Éducation mise à jour avec succès"}
@user_router.put("/{user_id}/time")
async def update_time_par_day(user_id: str, time_data: dict):
    if "time_par_day" not in time_data:
        raise HTTPException(status_code=400, detail="Le champ 'time_par_day' est requis")

    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"time_par_day": time_data["time_par_day"]}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé ou aucune modification")

    return {"message": "Temps par jour mis à jour avec succès"}

@user_router.put("/{user_id}/rang")                                                      
async def update_rang(user_id: str, time_data: dict):
    if "rang" not in time_data:
        raise HTTPException(status_code=400, detail="Le champ 'rang' est requis")

    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"rang": time_data["rang"]}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé ou aucune modification")

    return {"message": "rang par jour mis à jour avec succès"}
@user_router.put("/{user_id}", response_model=dict)
async def update_user(user_id: str, user: User):
    result = await db.users.update_one({"_id": get_objectid(user_id)}, {"$set": user.dict()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User updated successfully"}