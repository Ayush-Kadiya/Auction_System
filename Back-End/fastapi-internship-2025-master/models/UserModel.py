from pydantic import BaseModel,Field,validator
from bson import ObjectId
from typing import Optional, Dict, Any
import bcrypt   #pip install bcrypt



class User(BaseModel):
    firstName:str
    lastName:str
    age:int
    status:bool
    role_id:str
    email:str
    password:str
    
    #10,11,12,13,14,15,16,20,,,25,31
    @validator("password",pre=True,always=True)
    def encrypt_password(cls,v):
        if v is None:
            return None
        return bcrypt.hashpw(v.encode("utf-8"),bcrypt.gensalt())
        
    
    # @validator("role_id",pre=True,always=True)
    # def convert_objectId(cls,v):
    #     if isinstance(v,ObjectId):
    #         return str(v)
    #     return v

class UserOut(User):
    id: str = Field(alias="_id")
    firstName: str
    lastName: str
    age: Optional[int] = None
    status: Optional[bool] = None
    role_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[Dict[str, Any]] = None
    
    class Config:
        allow_population_by_extra_fields = True
    
    @validator("id", pre=True, always=True)
    def convert_objectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
    
    # @validator("role_id", pre=True, always=True)
    # def convert_role(cls, v):
    #     if isinstance(v, dict) and "role_id" in v:
    #         v["role_id"] = str(v["role_id"])
    #     return v
    
class UserLogin(BaseModel):
    email: str
    password: str    


class ResetPasswordReq(BaseModel):
    token: str
    password: str 