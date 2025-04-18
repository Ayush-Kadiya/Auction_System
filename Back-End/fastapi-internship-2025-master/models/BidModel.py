from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BidCreate(BaseModel):
    user_id: str
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    amount: float
    bid_time: Optional[datetime] = None

class Bid(BidCreate):
    id: Optional[str] = None
    timestamp: Optional[datetime] = None
    auction_id: Optional[str] = None
    
    class Config:
        from_attributes = True 