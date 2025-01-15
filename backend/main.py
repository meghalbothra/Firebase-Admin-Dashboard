from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from api import Alert
from firebase_admin import auth
from typing import Dict, List, Optional
from dotenv import load_dotenv
from datetime import datetime, timezone
import os
from api import user
import logging
from firebase_setup import initialize_firebase
from models import UserModel  # Import the UserModel class
from pydantic import BaseModel
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import BaseMessage, HumanMessage
import re
from langchain_core.globals import set_debug
# Load environment variables from .env file
load_dotenv()

# Initialize Firebase
initialize_firebase()

# Initialize FastAPI app
app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add CORS Middleware
from fastapi.middleware.cors import CORSMiddleware

# Define allowed origins
origins = [
    "http://localhost:5173",  # Local development frontend
    "https://firebase-admin-dashboard-4bu5n9gx2-meghals-projects.vercel.app",  # Production frontend (example 1)
    "https://firebase-admin-dashboard-flax.vercel.app"  # Production frontend (example 2)
]

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Explicitly define allowed origins
    allow_credentials=True,  # Allow credentials (e.g., cookies, authorization headers)
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Restrict to necessary methods
    allow_headers=["Authorization", "Content-Type", "Accept"],  # Restrict to necessary headers
)

app.include_router(Alert.router, tags=["Alert"])
app.include_router(user.router, tags=["Users"])  # Include the user router


# Define request and response schemas
class ChatRequest(BaseModel):
    message: str
    stat_card_info: Optional[Dict[str, int]] = None  # Dynamically passed stat card info


class ChatResponse(BaseModel):
    reply: str

stat_card_store = {}

# Initialize Google API Key
google_api_key: str = os.getenv("GOOGLE_API_KEY")

# Initialize the language model with a valid API key
llm: ChatGoogleGenerativeAI = ChatGoogleGenerativeAI(
    model="models/gemini-1.5-flash", google_api_key=google_api_key
)

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

# Disable debug mode
set_debug(False)

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_request: ChatRequest, request: Request):
    try:
        # Use the client's IP as a session identifier (or another unique identifier)
        client_id = request.client.host

        # Retrieve stat card info
        stat_card_info = stat_card_store.get(client_id, {})
        if chat_request.stat_card_info:
            stat_card_info.update(chat_request.stat_card_info)
            stat_card_store[client_id] = stat_card_info

        # First-time interaction
        if not chat_request.message or not chat_request.message.strip():
            starting_message = (
                "Hello! I am your virtual assistant. How can I assist you today?\n\n"
                f"Here are some system stats:\n"
                f"- Total Users: {stat_card_info.get('totalUsers', 'N/A')}\n"
                f"- Active Errors: {stat_card_info.get('activeErrors', 'N/A')}\n"
                f"- API Requests: {stat_card_info.get('apiRequests', 'N/A')}\n"
                f"- Database Operations: {stat_card_info.get('databaseOps', 'N/A')}\n"
            )
            return ChatResponse(reply=starting_message)

        # Prepare messages for the model
        stat_context = (
            f"Here are some system stats:\n"
            f"- Total Users: {stat_card_info.get('totalUsers', 'N/A')}\n"
            f"- Active Errors: {stat_card_info.get('activeErrors', 'N/A')}\n"
            f"- API Requests: {stat_card_info.get('apiRequests', 'N/A')}\n"
            f"- Database Operations: {stat_card_info.get('databaseOps', 'N/A')}\n"
        )
        messages = [
            HumanMessage(content=f"{stat_context}\n\n{chat_request.message.strip()}")
        ]

        # Log message content for debugging
        print("Messages sent to LLM:", [msg.content for msg in messages])

        # Call the language model
        response = llm.generate(messages=messages)

        # Extract reply
        reply = response.generations[0][0].message.content

        # Clean and return the reply
        return ChatResponse(reply=clean_reply(reply))

    except Exception as e:
        logger.error("Error processing chat request: %s", str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")


def clean_reply(reply: str) -> str:
    reply = re.sub(r"\*\*(.*?)\*\*", r"\1", reply)  # Remove bold formatting
    reply = reply.replace("\n", " ")  # Remove excessive newlines
    return reply
