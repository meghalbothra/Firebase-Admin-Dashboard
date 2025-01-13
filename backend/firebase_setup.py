from firebase_admin import credentials, initialize_app
import os
import json
from dotenv import load_dotenv
from fastapi import HTTPException

def initialize_firebase():
    # Load the environment variables from the .env file
    load_dotenv()

    # Retrieve the Firebase credentials from the environment variable
    firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")
    
    if not firebase_credentials:
        raise ValueError("FIREBASE_CREDENTIALS environment variable not set.")
    
    # Parse the credentials from the JSON string
    try:
        cred_dict = json.loads(firebase_credentials)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON format for FIREBASE_CREDENTIALS: {e}")

    # Initialize Firebase Admin SDK with the credentials
    try:
        cred = credentials.Certificate(cred_dict)
        initialize_app(cred)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initializing Firebase: {e}")


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