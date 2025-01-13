from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from firebase_setup import verify_login_status

# Create an APIRouter instance for the alert system
router = APIRouter()

# Define the schema for the alert rule
class AlertRule(BaseModel):
    user_id: str
    condition: Dict[str, str]  # Example: {"field": "temperature", "operator": ">", "value": "30"}
    frequency: str  # "once" or "recurring"
    notification_message: str
    next_alert_time: Optional[datetime] = None

# Mock storage for rules (use a database in production)
alert_rules: List[AlertRule] = []

# Endpoint to allow users to customize their alert rules
@router.post("/add-alert", response_model=AlertRule)
def add_alert(rule: AlertRule, user: dict = Depends(verify_login_status)):
    if rule.user_id != user["uid"]:
        raise HTTPException(status_code=403, detail="You can only add rules for your own account.")

    if rule.frequency == "once":
        rule.next_alert_time = datetime.now() + timedelta(minutes=1)
    elif rule.frequency == "recurring":
        rule.next_alert_time = datetime.now() + timedelta(hours=1)

    alert_rules.append(rule)
    return rule

# Endpoint to retrieve user-defined alert rules
@router.get("/get-alerts", response_model=List[AlertRule])
def get_alerts(user: dict = Depends(verify_login_status)):
    user_alerts = [rule for rule in alert_rules if rule.user_id == user["uid"]]
    return user_alerts

# Function to check conditions and simulate alerts
def check_and_trigger_alerts(data: dict):
    triggered_alerts = []
    for rule in alert_rules:
        field = rule.condition["field"]
        operator = rule.condition["operator"]
        value = float(rule.condition["value"])
        
        # Simulate data from an external source (e.g., temperature data)
        external_data = data.get(field)
        
        if external_data:
            # Check if the condition is met (e.g., "temperature" > 30)
            if operator == ">" and external_data > value:
                # Instead of sending an FCM notification, return the alert message
                triggered_alerts.append({
                    "user_id": rule.user_id,
                    "alert_message": rule.notification_message,
                    "condition": rule.condition,
                })

                # Update next alert time if the alert is recurring
                if rule.frequency == "recurring":
                    rule.next_alert_time = datetime.now() + timedelta(hours=1)
                else:
                    rule.next_alert_time = None  # One-time alert

    return {"triggered_alerts": triggered_alerts}

# Function to simulate checking and triggering alerts (you can call this with real data)
def simulate_alert_check():
    # Simulate external data (e.g., temperature or other metrics)
    external_data = {
        "temperature": 32,  # Example: temperature value that meets the condition
    }

    return check_and_trigger_alerts(external_data)
