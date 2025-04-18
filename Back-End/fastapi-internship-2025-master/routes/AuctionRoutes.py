from fastapi import APIRouter, HTTPException, UploadFile, Form, Body, Depends
from config.database import auction_collection, bid_collection
from models.AuctionModel import Auction, AuctionOut  # Corrected import path
from models.BidModel import Bid, BidCreate
from bson import ObjectId
from datetime import datetime
import cloudinary
import cloudinary.uploader

router = APIRouter()

# Configure Cloudinary
cloudinary.config(
    cloud_name="diqfvd7n5",  # Replace with your Cloudinary cloud name
    api_key="127178933421235",        # Replace with your Cloudinary API key
    api_secret="bvDM9uN9DLpmTVQEKGZ8jtacQq8"   # Replace with your Cloudinary API secret
)

@router.post("/auction/", response_model=AuctionOut)
async def create_auction(
    title: str = Form(...),
    description: str = Form(...),
    starting_bid: float = Form(...),
    start_time: str = Form(...),
    end_time: str = Form(...),
    created_by: str = Form(...),
    category: str = Form(...),  # New category field
    image: UploadFile = None
):
    # Upload image to Cloudinary
    image_url = None
    if image:
        upload_result = cloudinary.uploader.upload(image.file)
        image_url = upload_result.get("secure_url")

    # Create auction document
    auction_data = {
        "title": title,
        "description": description,
        "starting_bid": starting_bid,
        "start_time": start_time,
        "end_time": end_time,
        "created_by": created_by,
        "category": category,  # Include category in auction data
        "image": image_url,
    }

    result = await auction_collection.insert_one(auction_data)
    auction_data["_id"] = result.inserted_id
    return auction_data

@router.get("/auction/")
async def get_auctions(sort_by: str = "name", order: str = "asc", x_price: float = None):
    query = {}
    if x_price is not None:
        query["starting_bid"] = {"$lte": x_price}

    sort_order = 1 if order == "asc" else -1
    
    # Use collation for case-insensitive sorting when sorting by name
    options = {}
    if sort_by == "name":
        sort_field = "title"
        options["collation"] = {"locale": "en", "strength": 2}
    else:
        sort_field = sort_by
    
    auctions = await auction_collection.find(query).sort(sort_field, sort_order).collation({"locale": "en", "strength": 2} if sort_by == "name" else None).to_list(length=None)

    for auction in auctions:
        auction["id"] = str(auction["_id"])
        del auction["_id"]

    return auctions

@router.get("/auctions/")
async def get_auctions(
    search: str = None,
    category: str = None,
    min_price: float = None,
    max_price: float = None,
    sort_by: str = "name",
    order: str = "asc"
):
    query = {}

    # Apply search filter
    if search:
        query["title"] = {"$regex": search, "$options": "i"}

    # Apply category filter
    if category and category != "All":
        query["category"] = category

    # Apply price range filter
    if min_price is not None or max_price is not None:
        query["starting_bid"] = {}
        if min_price is not None:
            query["starting_bid"]["$gte"] = min_price
        if max_price is not None:
            query["starting_bid"]["$lte"] = max_price

    # Determine sort order
    sort_order = 1 if order == "asc" else -1

    # Map sort_by to database fields
    sort_field = "title" if sort_by == "name" else sort_by

    # Fetch and sort auctions with case-insensitive collation for name sorting
    auctions = await auction_collection.find(query).sort(sort_field, sort_order).collation({"locale": "en", "strength": 2} if sort_by == "name" else None).to_list(length=None)

    # Convert ObjectId to string and map to "id"
    for auction in auctions:
        auction["id"] = str(auction["_id"])
        del auction["_id"]

    return {"status": "success", "data": auctions}

@router.put("/auction/{auction_id}")
async def update_auction(
    auction_id: str,
    title: str = Form(...),
    description: str = Form(...),
    starting_bid: float = Form(...),
    start_time: str = Form(...),
    end_time: str = Form(...),
    category: str = Form(...),
    created_by: str = Form(...),  # Include created_by in the update logic
    image: UploadFile = None
):
    # Upload image to Cloudinary if provided
    image_url = None
    if image:
        upload_result = cloudinary.uploader.upload(image.file)
        image_url = upload_result.get("secure_url")

    # Prepare update data
    update_data = {
        "title": title,
        "description": description,
        "starting_bid": starting_bid,
        "start_time": start_time,
        "end_time": end_time,
        "category": category,
        "created_by": created_by,  # Include created_by in the update data
    }
    if image_url:
        update_data["image"] = image_url

    # Update auction document
    result = await auction_collection.update_one(
        {"_id": ObjectId(auction_id)}, {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Auction not found or no changes made")
    return {"message": "Auction updated successfully"}

@router.delete("/auction/{auction_id}")
async def delete_auction(auction_id: str):
    result = await auction_collection.delete_one({"_id": ObjectId(auction_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Auction not found")
    return {"message": "Auction deleted successfully"}

@router.get("/auctions/{auction_id}/bids")
async def get_auction_bids(auction_id: str):
    try:
        # Verify auction exists
        auction = await auction_collection.find_one({"_id": ObjectId(auction_id)})
        if not auction:
            raise HTTPException(status_code=404, detail="Auction not found")

        # Get all bids for this auction
        bids = await bid_collection.find({"auction_id": auction_id}).sort("amount", -1).to_list(length=None)
        
        # Convert ObjectId to string for each bid
        for bid in bids:
            bid["_id"] = str(bid["_id"])
            if "timestamp" in bid:
                bid["timestamp"] = bid["timestamp"].isoformat()

        return bids

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/auctions/{auction_id}/current-status")
async def get_auction_current_status(auction_id: str):
    try:
        # Verify auction exists
        auction = await auction_collection.find_one({"_id": ObjectId(auction_id)})
        if not auction:
            raise HTTPException(status_code=404, detail="Auction not found")

        # Get all bids for this auction
        bids = await bid_collection.find({"auction_id": auction_id}).sort("amount", -1).to_list(length=None)
        
        # Get current highest bid
        current_highest_bid = auction.get("starting_bid", 0)
        top_bidders = []
        
        if bids:
            # Update current highest bid
            current_highest_bid = max(current_highest_bid, bids[0]["amount"])
            
            # Get top 3 bidders
            top_bidders = bids[:3]
            for bid in top_bidders:
                bid["_id"] = str(bid["_id"])
                if "timestamp" in bid:
                    bid["timestamp"] = bid["timestamp"].isoformat()

        return {
            "current_highest_bid": current_highest_bid,
            "top_bidders": top_bidders,
            "last_update": datetime.now().isoformat()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auctions/{auction_id}/bids")
async def place_bid(auction_id: str, bid: BidCreate):
    try:
        # Verify auction exists and is active
        auction = await auction_collection.find_one({"_id": ObjectId(auction_id)})
        if not auction:
            raise HTTPException(status_code=404, detail="Auction not found")

        # Check if auction has ended
        end_time = datetime.fromisoformat(auction["end_time"].replace('Z', '+00:00'))
        if datetime.now() > end_time:
            raise HTTPException(status_code=400, detail="Auction has ended")

        # Get current highest bid
        highest_bid = await bid_collection.find_one(
            {"auction_id": auction_id},
            sort=[("amount", -1)]
        )
        current_highest = highest_bid["amount"] if highest_bid else auction["starting_bid"]

        # Validate bid amount
        if bid.amount <= current_highest:
            raise HTTPException(
                status_code=400,
                detail=f"Bid must be higher than current highest bid: {current_highest}"
            )

        # Create new bid
        new_bid = Bid(
            **bid.dict(),
            auction_id=auction_id,
            timestamp=datetime.now()
        )

        # Insert bid into database
        result = await bid_collection.insert_one(new_bid.dict())
        
        # Update auction's current highest bid
        await auction_collection.update_one(
            {"_id": ObjectId(auction_id)},
            {"$set": {"current_highest_bid": bid.amount}}
        )

        # Get updated top bidders
        updated_bids = await bid_collection.find({"auction_id": auction_id}).sort("amount", -1).limit(3).to_list(length=None)
        top_bidders = []
        for b in updated_bids:
            b["_id"] = str(b["_id"])
            if "timestamp" in b:
                b["timestamp"] = b["timestamp"].isoformat()
            top_bidders.append(b)

        return {
            "message": "Bid placed successfully",
            "bid_id": str(result.inserted_id),
            "amount": bid.amount,
            "current_highest_bid": bid.amount,
            "top_bidders": top_bidders,
            "last_update": datetime.now().isoformat()
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/auctions/{auction_id}/bids/payment")
async def update_bid_payment(auction_id: str, user_id: str = Body(...)):
    try:
        # Find the highest bid for this auction and user
        highest_bid = await bid_collection.find_one(
            {
                "auction_id": auction_id,
                "user_id": user_id
            },
            sort=[("amount", -1)]
        )

        if not highest_bid:
            raise HTTPException(status_code=404, detail="No bid found for this user and auction")

        # Update the bid payment status
        result = await bid_collection.update_one(
            {"_id": highest_bid["_id"]},
            {"$set": {"is_paid": True}}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Failed to update payment status")

        return {"message": "Payment status updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))