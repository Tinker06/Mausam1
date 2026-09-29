import logging
import firebase_admin
from firebase_admin import credentials, firestore
from backend.config import settings

logger = logging.getLogger("mausam.firebase")

db_firestore = None

def init_firebase_admin():
    global db_firestore
    if db_firestore is not None:
        return db_firestore

    if settings.firebase_project_id and settings.firebase_client_email and settings.firebase_private_key:
        try:
            cred_dict = {
                "type": "service_account",
                "project_id": settings.firebase_project_id,
                "client_email": settings.firebase_client_email,
                "private_key": settings.firebase_private_key,
                "token_uri": "https://oauth2.googleapis.com/token",
            }
            cred = credentials.Certificate(cred_dict)
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred)
            db_firestore = firestore.client()
            logger.info(f"Firebase Admin SDK successfully connected to Cloud Firestore (Project: {settings.firebase_project_id})")
            return db_firestore
        except Exception as e:
            logger.error(f"Failed to initialize Firebase Admin SDK: {e}")
            return None
    else:
        logger.info("Firebase Admin credentials not fully configured in .env. Operating in SQLite local mode.")
        return None

def sync_user_to_firestore(user_id: str, email: str, name: str, persona: str, language: str):
    client = init_firebase_admin()
    if client:
        try:
            doc_ref = client.collection("users").document(user_id)
            doc_ref.set({
                "id": user_id,
                "email": email,
                "name": name,
                "default_persona": persona,
                "preferred_language": language,
                "updated_at": firestore.SERVER_TIMESTAMP
            }, merge=True)
            logger.info(f"Synced user {email} to Cloud Firestore 'users' collection.")
        except Exception as e:
            logger.error(f"Error syncing user to Firestore: {e}")

def sync_saved_location_to_firestore(location_id: str, user_id: str, city: str, lat: float, lon: float):
    client = init_firebase_admin()
    if client:
        try:
            doc_ref = client.collection("saved_locations").document(location_id)
            doc_ref.set({
                "id": location_id,
                "user_id": user_id,
                "city": city,
                "latitude": lat,
                "longitude": lon,
                "created_at": firestore.SERVER_TIMESTAMP
            }, merge=True)
            logger.info(f"Synced saved location {city} to Cloud Firestore 'saved_locations' collection.")
        except Exception as e:
            logger.error(f"Error syncing location to Firestore: {e}")

def sync_alert_to_firestore(alert_id: str, city: str, severity: str, message: str, reason: str):
    client = init_firebase_admin()
    if client:
        try:
            doc_ref = client.collection("weather_alerts").document(alert_id)
            doc_ref.set({
                "id": alert_id,
                "city": city,
                "severity": severity,
                "message": message,
                "reason": reason,
                "created_at": firestore.SERVER_TIMESTAMP
            }, merge=True)
            logger.info(f"Synced weather alert for {city} ({severity}) to Cloud Firestore 'weather_alerts' collection.")
        except Exception as e:
            logger.error(f"Error syncing alert to Firestore: {e}")
