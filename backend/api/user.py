from fastapi import APIRouter, HTTPException, Depends
from firebase_admin import auth
from typing import List
from datetime import datetime
from models import UserModel
# Import Firebase verification middleware
from firebase_setup import verify_login_status

router = APIRouter()

# Middleware or Dependency to Verify Admin Token
def verify_admin(token: str):
    """
    Middleware to verify Firebase ID token and admin role.
    """
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Invalid or missing token: {str(e)}")

# Helper function to format the timestamp to a readable date
def format_timestamp(timestamp: int) -> str:
    if not timestamp:
        return "N/A"  # Return "N/A" if timestamp is missing
    # Convert timestamp from seconds to milliseconds if needed and format
    return datetime.utcfromtimestamp(timestamp / 1000).strftime('%d/%m/%Y, %I:%M:%S %p')

# Endpoint to fetch all users
@router.get("/users", response_model=List[UserModel])
async def get_users(admin: dict = Depends(verify_admin)):
    """
    Fetch all Firebase users in batches and show their email, UID, account creation date, 
    last sign-in date, whether email is verified, and whether the user account is disabled.
    """
    try:
        users = []
        page = auth.list_users()  # Fetch the first batch of users
        while page:
            for user in page.users:
                user_data = {
                    "uid": user.uid,  # User's UID
                    "email": user.email,  # User's email
                    "creation_time": format_timestamp(user.user_metadata.creation_timestamp),  # Format the creation timestamp
                    "last_sign_in_time": format_timestamp(user.user_metadata.last_sign_in_timestamp),  # Format the last sign-in timestamp
                    "email_verified": user.email_verified,  # Whether the email is verified
                    "disabled": user.disabled,  # Whether the account is disabled
                }
                users.append(user_data)
            page = page.get_next_page()  # Fetch next page of users if available
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))