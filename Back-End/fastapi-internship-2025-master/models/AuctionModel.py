from pydantic import BaseModel, Field, validator
from bson import ObjectId

class Auction(BaseModel):
    title: str
    description: str
    starting_bid: float
    start_time: str
    end_time: str
    created_by: str  # User ID
    image: str  # URL of the auction image
    category: str  # New field for category

class AuctionOut(Auction):
    id: str = Field(alias="_id")

    @validator("id", pre=True, always=True)
    def convert_objectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
