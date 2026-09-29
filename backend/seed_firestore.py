import asyncio
import logging
from backend.services.firebase_service import (
    init_firebase_admin, 
    sync_saved_location_to_firestore, 
    sync_user_to_firestore, 
    sync_alert_to_firestore
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mausam.seed")

DEFAULT_CITIES = [
    ("loc_chennai", "demo-user", "Chennai", 13.0827, 80.2707),
    ("loc_mumbai", "demo-user", "Mumbai", 19.0760, 72.8777),
    ("loc_bengaluru", "demo-user", "Bengaluru", 12.9716, 77.5946),
    ("loc_delhi", "demo-user", "Delhi", 28.6139, 77.2090),
    ("loc_hyderabad", "demo-user", "Hyderabad", 17.3850, 78.4867),
    ("loc_kolkata", "demo-user", "Kolkata", 22.5726, 88.3639),
    ("loc_coimbatore", "demo-user", "Coimbatore", 11.0168, 76.9558),
    ("loc_madurai", "demo-user", "Madurai", 9.9252, 78.1198),
    ("loc_trichy", "demo-user", "Trichy", 10.7905, 78.7047),
    ("loc_london", "demo-user", "London", 51.5074, -0.1278),
    ("loc_newyork", "demo-user", "New York", 40.7128, -74.0060),
    ("loc_tokyo", "demo-user", "Tokyo", 35.6762, 139.6503),
]

DEFAULT_PERSONAS = [
    ("user_health", "health_user@mausam.app", "Health Enthusiast", "health", "en"),
    ("user_fitness", "fitness_user@mausam.app", "Outdoor Athlete", "fitness", "en"),
    ("user_beach", "beach_user@mausam.app", "Coastal Swimmer", "beach", "en"),
    ("user_traveler", "traveler_user@mausam.app", "Global Traveler", "traveler", "en"),
    ("user_parents", "parents_user@mausam.app", "Caregiver Parent", "parents", "ta"),
    ("user_agriculture", "farmer_user@mausam.app", "Agricultural Farmer", "agriculture", "hi"),
    ("user_commuters", "commuter_user@mausam.app", "Daily Commuter", "commuters", "en"),
    ("user_event_planners", "event_user@mausam.app", "Event Organizer", "event_planners", "en"),
]

DEFAULT_ALERTS = [
    ("alert_chennai_heat", "Chennai", "MODERATE", "Weather Advisory for Chennai: Afternoon high UV radiation and humidity.", "UV index 7.4 exceeds threshold"),
    ("alert_delhi_aqi", "Delhi", "SEVERE", "Air Quality Warning for Delhi: AQI 210 unhealthy range.", "Particulate matter PM2.5 elevated"),
    ("alert_mumbai_rain", "Mumbai", "MODERATE", "Rain Advisory for Mumbai: Moderate showers expected during peak commute hours.", "Precipitation probability 65%")
]

def run_seed():
    logger.info("Connecting to Firebase Cloud Firestore for bulk seed...")
    client = init_firebase_admin()
    if not client:
        logger.error("Could not connect to Firebase Admin. Check your .env file credentials.")
        return

    logger.info("Seeding pre-existing saved locations to Firestore...")
    for loc_id, u_id, city, lat, lon in DEFAULT_CITIES:
        sync_saved_location_to_firestore(loc_id, u_id, city, lat, lon)

    logger.info("Seeding default user personas to Firestore...")
    for u_id, email, name, persona, lang in DEFAULT_PERSONAS:
        sync_user_to_firestore(u_id, email, name, persona, lang)

    logger.info("Seeding default weather alerts to Firestore...")
    for a_id, city, sev, msg, reason in DEFAULT_ALERTS:
        sync_alert_to_firestore(a_id, city, sev, msg, reason)

    logger.info("🎉 Firestore bulk seed complete! Check your Firebase Console under 'saved_locations', 'users', and 'weather_alerts'.")

if __name__ == "__main__":
    run_seed()
