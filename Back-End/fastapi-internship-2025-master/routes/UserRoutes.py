from fastapi import APIRouter, HTTPException 
from controllers.UserController import addUser,getAllUsers,loginUser,forgotPassword,resetPassword,getUserById
from models.UserModel import User,UserOut,UserLogin,ResetPasswordReq

from bson import ObjectId
from config.database import user_collection, role_collection

router = APIRouter()

@router.get("/user_details/{id}")
async def get_user_by_id(id:str):
    return await getUserById(id)

@router.post("/user/")
async def post_user(user:User):
    return await addUser(user)

@router.get("/users/")
async def get_users():
    return await getAllUsers()

@router.post("/user/login/")
async def login_user(user:UserLogin):
    return await loginUser(user)

@router.post("/forgotpassword")
async def forgot_password(email:str):
     return await forgotPassword(email)
 
@router.post("/resetpassword")
async def reset_password(data:ResetPasswordReq):
     return await resetPassword(data)
 
 

# Fetch all users
@router.get("/users/", response_model=list[UserOut])
async def get_all_users():
    users = await user_collection.find().to_list(length=None)
    for user in users:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
    return users


# Update user
@router.put("/users/{user_id}")
async def update_user(user_id: str, user: User):
    print(f"Updating user with ID: {user_id}")
    print(f"Data received: {user.dict()}")

    update_data = user.dict(exclude_unset=True)  # Exclude fields not provided
    if "password" in update_data and not update_data["password"]:
        del update_data["password"]  # Remove empty password field

    result = await user_collection.update_one(
        {"_id": ObjectId(user_id)}, {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or no changes made")
    return {"message": "User updated successfully"}


# Delete user
@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    result = await user_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.get("/user/profile/", response_model=UserOut)
async def get_user_profile(user_id: str):
    try:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
            
        user = await user_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        # Convert ObjectId to string for the response
        user["_id"] = str(user["_id"])
        
        # Get role information if available
        if "role_id" in user and ObjectId.is_valid(user["role_id"]):
            role = await role_collection.find_one({"_id": ObjectId(user["role_id"])})
            if role:
                user["role"] = role
                user["role"]["_id"] = str(role["_id"])
                
        return user
    except Exception as e:
        print(f"Error in get_user_profile: {str(e)}")  # Add logging
        raise HTTPException(status_code=500, detail=str(e))