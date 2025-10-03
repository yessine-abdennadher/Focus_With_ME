from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Emotion(BaseModel):
    user_id: str
    emotion: str
    confidence: float  # Ajout de la confiance
    timestamp: Optional[datetime] = None
