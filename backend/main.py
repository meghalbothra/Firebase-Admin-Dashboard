from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from api import Alert
from firebase_admin import auth
from typing import Dict, List, Optional
from dotenv import load_dotenv
from datetime import datetime, timezone
import os
from api import user

from firebase_setup import initialize_firebase
from models import UserModel  # Import the UserModel class
from pydantic import BaseModel
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import BaseMessage, HumanMessage
import re

# Load environment variables from .env file
load_dotenv()

# Initialize Firebase
initialize_firebase()

# Initialize FastAPI app
app = FastAPI()

# Add CORS Middleware
# origins = [
#     'http://localhost:5173', 'https://firebase-admin-dashboard-4bu5n9gx2-meghals-projects.vercel.app' # Frontend URL, change this as per your frontend location
#     # Add other allowed origins if necessary
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["Content-Type", "Authorization"]  # Allow all HTTP headers
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

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_request: ChatRequest, request: Request):
    """
    Chat endpoint to handle user queries.
    """
    try:
        # Use the client's IP as a session identifier (or another unique identifier)
        client_id = request.client.host

        # Retrieve stat card info from global storage or use the provided one
        stat_card_info = stat_card_store.get(client_id, {})
        if chat_request.stat_card_info:
            stat_card_info.update(chat_request.stat_card_info)
            stat_card_store[client_id] = stat_card_info

        # Log the current stat card data for debugging
        print("Stat Card Info:", stat_card_info)

        # First-time interaction, send stat card info and fixed welcome message
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

        # Add stat card context for generating relevant replies
        stat_context = (
            f"Here are some system stats:\n"
            f"- Total Users: {stat_card_info.get('totalUsers', 'N/A')}\n"
            f"- Active Errors: {stat_card_info.get('activeErrors', 'N/A')}\n"
            f"- API Requests: {stat_card_info.get('apiRequests', 'N/A')}\n"
            f"- Database Operations: {stat_card_info.get('databaseOps', 'N/A')}\n"
        )

        # Prepare messages for the model with stat context
        messages = [
            [HumanMessage(content=f"{stat_context}\n\n{chat_request.message.strip()}")]
        ]

        # Call the language model
        response = llm.generate(messages=messages)

        # Extract reply from the generations list
        generations = response.generations
        if not generations:
            raise ValueError("No generations found in the response.")

        # Get the AIMessage content from the first generation
        ai_message = generations[0][0].message
        reply = ai_message.content if ai_message else "No response"

        # Clean up the reply to make it more structured and presentable
        reply = clean_reply(reply)

        return ChatResponse(reply=reply)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

def clean_reply(reply: str) -> str:
    """
    Cleans the reply text by removing unwanted markdown and line breaks.
    """
    # Remove bold formatting (e.g., **bold** becomes bold text)
    reply = re.sub(r"\*\*(.*?)\*\*", r"\1", reply)

    # Remove any excessive newlines
    reply = reply.replace("\n", " ")

    return reply