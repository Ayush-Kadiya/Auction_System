from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# ... existing imports and models ...

class Bid(BaseModel):
    amount: float
    user_id: str
    timestamp: Optional[datetime] = None

@app.post("/auctions/{auction_id}/bids")
async def create_bid(auction_id: str, bid: Bid):
    try:
        # Validate user is authenticated
        if not bid.user_id:
            raise HTTPException(status_code=401, detail="User must be authenticated to place a bid")

        # Get the auction
        auction = await db.auctions.find_one({"_id": auction_id})
        if not auction:
            raise HTTPException(status_code=404, detail="Auction not found")

        # Validate auction is still active
        current_time = datetime.utcnow()
        if current_time < auction["start_time"] or current_time > auction["end_time"]:
            raise HTTPException(status_code=400, detail="Auction is not active")

        # Get current highest bid
        current_highest_bid = auction.get("starting_bid", 0)
        existing_bids = await db.bids.find({"auction_id": auction_id}).sort("amount", -1).to_list(1)
        if existing_bids:
            current_highest_bid = existing_bids[0]["amount"]

        # Validate bid amount
        if bid.amount <= current_highest_bid:
            raise HTTPException(
                status_code=400, 
                detail=f"Bid must be higher than current highest bid: {current_highest_bid}"
            )

        # Create new bid
        new_bid = {
            "auction_id": auction_id,
            "user_id": bid.user_id,
            "amount": bid.amount,
            "timestamp": datetime.utcnow()
        }
        
        result = await db.bids.insert_one(new_bid)
        
        # Update auction with new highest bid
        await db.auctions.update_one(
            {"_id": auction_id},
            {"$set": {"current_highest_bid": bid.amount}}
        )

        return {"message": "Bid placed successfully", "bid_id": str(result.inserted_id)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/auctions/{auction_id}/bids")
async def get_auction_bids(auction_id: str):
    try:
        # Get all bids for the auction, sorted by amount in descending order
        bids = await db.bids.find(
            {"auction_id": auction_id}
        ).sort("amount", -1).to_list(None)

        # Format bids for response
        formatted_bids = []
        for bid in bids:
            formatted_bids.append({
                "amount": bid["amount"],
                "user_id": bid["user_id"],
                "timestamp": bid["timestamp"]
            })

        return formatted_bids

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ... existing code ...
