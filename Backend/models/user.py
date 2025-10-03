from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    name: str
    email: str
    FamilyName:str
    password: str
    country: Optional[str] = None
    education: Optional[str] = None
    rang: Optional[int] = 0
    time_par_day: Optional[float] = 0.0
    