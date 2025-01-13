from pydantic import BaseModel

# User Model for Response
class UserModel(BaseModel):
    uid: str
    email: str
    creation_time: str  # Formatted date as string

    class Config:
        # This will allow Pydantic to work with the timestamps correctly
        orm_mode = True
