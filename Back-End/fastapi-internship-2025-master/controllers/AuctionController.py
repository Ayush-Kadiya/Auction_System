from fastapi import APIRouter, HTTPException
from models.AuctionModel import Auction
from models.BidModel import BidCreate, Bid
from config.database import auction_collection
from fastapi.responses import JSONResponse
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/auction")
async def addAuction(auction: Auction):
    result = await auction_collection.insert_one(auction.dict())
    return JSONResponse(content={"message": "Auction created successfully!", "id": str(result.inserted_id)}, status_code=201)

@router.get("/auctions")
async def getAllAuctions():
    auctions = await auction_collection.find().to_list(length=None)
    for auction in auctions:
        auction["_id"] = str(auction["_id"])  # Convert ObjectId to string
    return auctions

@router.post("/auctions/{auction_id}/bids")
async def place_bid(auction_id: str, bid: BidCreate):
    try:
        # Convert string ID to ObjectId
        auction_object_id = ObjectId(auction_id)
        
        # First check if auction exists and get current highest bid
        auction = await auction_collection.find_one({"_id": auction_object_id})
        if not auction:
            raise HTTPException(status_code=404, detail="Auction not found")

        # Check if auction has ended
        current_time = datetime.utcnow()
        end_time = datetime.fromisoformat(auction['end_time'].replace('Z', '+00:00'))
        
        if current_time > end_time:
            raise HTTPException(status_code=400, detail="Auction has ended")

        # Check if auction has started
        start_time = datetime.fromisoformat(auction['start_time'].replace('Z', '+00:00'))
        if current_time < start_time:
            raise HTTPException(status_code=400, detail="Auction has not started yet")

        current_highest_bid = auction.get('current_highest_bid', auction.get('starting_bid', 0))
        
        # Validate bid amount
        if bid.amount <= current_highest_bid:
            raise HTTPException(
                status_code=400, 
                detail=f"Bid amount must be higher than current highest bid: ₹{current_highest_bid}"
            )

        # Create bid record with auction_id
        new_bid = {
            "amount": bid.amount,
            "user_id": bid.user_id,
            "username": bid.username,
            "first_name": bid.first_name or "",
            "last_name": bid.last_name or "",
            "timestamp": current_time,
            "auction_id": auction_id  # Add auction_id here
        }

        # Update auction with new bid
        update_result = await auction_collection.update_one(
            {"_id": auction_object_id},
            {
                "$set": {
                    "current_highest_bid": bid.amount,
                    "last_bid_timestamp": current_time,
                    "last_bidder": {
                        "user_id": bid.user_id,
                        "username": bid.username,
                        "first_name": bid.first_name or "",
                        "last_name": bid.last_name or ""
                    }
                },
                "$push": {
                    "bids": new_bid
                }
            }
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Failed to update auction bid")

        # Get updated auction with all bids
        updated_auction = await auction_collection.find_one({"_id": auction_object_id})
        if updated_auction:
            updated_auction["_id"] = str(updated_auction["_id"])
            
            # Sort bids by amount in descending order
            if "bids" in updated_auction:
                updated_auction["bids"] = sorted(
                    updated_auction["bids"],
                    key=lambda x: (x["amount"], x["timestamp"]),
                    reverse=True
                )

        return JSONResponse(
            content={
                "message": "Bid placed successfully",
                "auction": updated_auction,
                "current_highest_bid": bid.amount,
                "top_bidders": updated_auction.get("bids", [])[:3] if updated_auction else []
            },
            status_code=200
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/auctions/{auction_id}/bids")
async def get_auction_bids(auction_id: str):
    try:
        auction = await auction_collection.find_one({"_id": ObjectId(auction_id)})
        if not auction:
            raise HTTPException(status_code=404, detail="Auction not found")
            
        bids = auction.get("bids", [])
        # Sort bids by amount in descending order
        sorted_bids = sorted(bids, key=lambda x: (x["amount"], x["timestamp"]), reverse=True)
        
        return sorted_bids
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
