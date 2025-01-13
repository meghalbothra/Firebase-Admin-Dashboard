from firebase_admin import credentials, initialize_app, auth
import os
from fastapi import HTTPException

def initialize_firebase():
    # Path to your Firebase service account key
    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
    if not cred_path:
        raise ValueError("FIREBASE_CREDENTIALS_PATH environment variable not set.")
    
    # Initialize Firebase Admin SDK
    cred = credentials.Certificate(cred_path)
    initialize_app(cred)

# Middleware or Dependency to Verify Login Token
def verify_login_status(token: str):
    """
    Middleware to verify if a user is logged in by checking Firebase ID token.
    """
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"User is not logged in: {str(e)}")