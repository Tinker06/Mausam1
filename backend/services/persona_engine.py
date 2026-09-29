import logging
from typing import Dict, Any, List
from backend.schemas.weather import NormalizedWeather
from backend.schemas.recommendation import RecommendationResponse, RecommendationCardItem

logger = logging.getLogger("mausam.persona")

def generate_recommendations(persona: str, weather: NormalizedWeather) -> RecommendationResponse:
    p_clean = (persona or "health").strip().lower().replace(" ", "_")
    
    cards: List[RecommendationCardItem] = []
    priority = "low"
    headline = "Optimal Environmental Conditions"
    message_key = f"personalization.{p_clean}.normal"
    message = "Weather conditions are comfortable for your activities."

    # 1. HEALTH PERSONA
    if p_clean == "health":
        aqi_val = weather.aqi if weather.aqi is not None else 50
        uv_val = weather.uv_index if weather.uv_index is not None else 2.0
        pollen_val = weather.pollen_level or "low"

        cards.append(RecommendationCardItem(type="air_quality", value=f"AQI: {aqi_val} ({'Good' if aqi_val < 50 else 'Moderate' if aqi_val < 100 else 'Unhealthy'})"))
        cards.append(RecommendationCardItem(type="uv_protection", value=f"UV Index: {uv_val} ({'Low' if uv_val < 3 else 'High' if uv_val > 6 else 'Moderate'})"))
        cards.append(RecommendationCardItem(type="pollen_level", value=f"Pollen Level: {pollen_val.title()}"))

        if aqi_val > 150:
            priority = "high"
            headline = "Air Quality Health Warning"
            message_key = "personalization.health.aqi_warning"
            message = "Poor Air Quality detected (AQI > 150). Sensitive groups and individuals with respiratory conditions should limit prolonged outdoor exertion and wear N95 masks."
        elif uv_val > 7:
            priority = "medium"
            headline = "High UV Radiation Warning"
            message_key = "personalization.health.uv_warning"
            message = "High solar UV radiation outdoors. Apply SPF 50+ broad-spectrum sunscreen and wear UV-blocking sunglasses."
        elif pollen_val == "high":
            priority = "medium"
            headline = "Elevated Pollen Risk"
            message_key = "personalization.health.pollen_risk"
            message = "Pollen count is high today. Keep windows closed and consider antihistamines if prone to seasonal allergies."
        else:
            priority = "low"
            headline = "Clean Outdoor Health Score"
            message_key = "personalization.health.good"
            message = "Air quality is good and UV index is mild. Enjoy outdoor activities with standard hydration."

    # 2. FITNESS PERSONA
    elif p_clean == "fitness":
        temp = weather.temperature
        humidity = weather.humidity
        rain_prob = weather.rain_probability
        wind = weather.wind_speed

        cards.append(RecommendationCardItem(type="workout_window", value="Optimal window: 06:00 AM - 08:30 AM"))
        cards.append(RecommendationCardItem(type="heat_index", value=f"Feels like: {weather.feels_like}°C (Humidity {humidity}%)"))
        cards.append(RecommendationCardItem(type="rain_risk", value=f"Rain Chance: {rain_prob}% | Wind: {wind} km/h"))

        if temp > 35 or weather.feels_like > 38:
            priority = "high"
            headline = "Extreme Heat Warning for Exercise"
            message_key = "personalization.fitness.heat_danger"
            message = "Strenuous outdoor exercise is hazardous in severe heat. Risk of heat cramps or exhaustion. Shift workouts indoors or to late evening."
        elif rain_prob > 60:
            priority = "medium"
            headline = "High Rain Risk for Outdoor Running"
            message_key = "personalization.fitness.rain_warning"
            message = f"High precipitation probability ({rain_prob}%). Prepare moisture-wicking water-resistant gear or stick to indoor training."
        elif temp < 10:
            priority = "medium"
            headline = "Chilly Conditions for Workouts"
            message_key = "personalization.fitness.cold_gear"
            message = "Cool weather training. Wear insulated thermal layers and maintain adequate warmup routine."
        else:
            priority = "low"
            headline = "Great Outdoor Workout Weather"
            message_key = "personalization.fitness.best_hours"
            message = "Conditions are ideal for outdoor running, cycling, or sports. Stay hydrated with electrolytes."

    # 3. BEACH PERSONA
    elif p_clean == "beach":
        wave_h = weather.wave_height_m if weather.wave_height_m is not None else 1.0
        water_t = weather.water_temperature if weather.water_temperature is not None else 26.0
        wind = weather.wind_speed
        uv = weather.uv_index if weather.uv_index is not None else 5.0

        cards.append(RecommendationCardItem(type="wave_height", value=f"Swell Height: {wave_h} meters"))
        cards.append(RecommendationCardItem(type="water_temp", value=f"Sea Temp: {water_t}°C"))
        cards.append(RecommendationCardItem(type="beach_safety", value=f"Wind: {wind} km/h | UV: {uv}"))

        if wave_h > 2.5:
            priority = "high"
            headline = "Rough Sea & High Swell Warning"
            message_key = "personalization.beach.high_swell"
            message = f"High wave swell ({wave_h}m) and strong ocean currents detected. Swimming and small craft water activities are unsafe."
        elif uv > 8:
            priority = "medium"
            headline = "Intense Beach Solar Radiation"
            message_key = "personalization.beach.uv_sunburn"
            message = "Very strong UV radiation near water reflections. Seek shade between 11 AM and 3 PM, reapply waterproof sunscreen every 2 hours."
        else:
            priority = "low"
            headline = "Pleasant Beach & Swimming Conditions"
            message_key = "personalization.beach.optimal"
            message = "Calm waves and warm sea water temperatures. Excellent weather for coastal relaxation and swimming."

    # 4. TRAVELER PERSONA
    elif p_clean == "traveler":
        temp = weather.temperature
        cond = weather.condition
        rain = weather.rain_probability
        wind = weather.wind_speed

        cards.append(RecommendationCardItem(type="packing_guide", value="Light breathable clothing & umbrella recommended" if rain > 40 else "Standard travel wardrobe"))
        cards.append(RecommendationCardItem(type="road_vis", value=f"Visibility & Wind: {wind} km/h wind"))
        cards.append(RecommendationCardItem(type="alert_check", value="Destination Weather Checked"))

        if rain > 70 or wind > 45:
            priority = "high"
            headline = "Severe Weather Travel Advisory"
            message_key = "personalization.traveler.travel_disruption"
            message = f"Severe rainfall or high winds ({wind} km/h) may cause transit or flight delays. Allow extra buffer time and check airline updates."
        elif temp > 33:
            priority = "medium"
            headline = "Hot Climate Destination Advisory"
            message_key = "personalization.traveler.hot_destination"
            message = f"Destination temperature is high ({temp}°C). Pack sunglasses, sun hat, lightweight linen/cotton clothes, and stay hydrated."
        else:
            priority = "low"
            headline = "Smooth Travel Weather"
            message_key = "personalization.traveler.smooth"
            message = "Stable weather conditions expected along your route and destination."

    # 5. PARENTS PERSONA
    elif p_clean == "parents":
        temp = weather.temperature
        rain = weather.rain_probability
        uv = weather.uv_index if weather.uv_index is not None else 3.0
        aqi = weather.aqi if weather.aqi is not None else 45

        cards.append(RecommendationCardItem(type="playtime_score", value="Playtime Score: 9/10 (Safe for outdoor park)"))
        cards.append(RecommendationCardItem(type="clothing_guide", value="Cotton T-shirt & cap" if temp > 28 else "Warm jacket & socks"))
        cards.append(RecommendationCardItem(type="sunscreen_alert", value=f"UV Risk: {uv} (Sunscreen timer: 2 hours)"))

        if rain > 50:
            priority = "medium"
            headline = "Rain Advisory for Outdoor Play"
            message_key = "personalization.parents.rain_indoor"
            message = "Rain expected today. Plan indoor games, crafts, or museum visits for children."
        elif temp > 36 or uv > 8:
            priority = "high"
            headline = "Heat & UV Precaution for Kids"
            message_key = "personalization.parents.heat_children"
            message = "High heat and UV indices can affect young children quickly. Keep play indoors during midday peak solar hours."
        else:
            priority = "low"
            headline = "Ideal Outdoor Play Day"
            message_key = "personalization.parents.ideal_play"
            message = "Weather is pleasant for park activities, strollers, and outdoor family outings."

    # 6. AGRICULTURE PERSONA
    elif p_clean == "agriculture":
        temp = weather.temperature
        humidity = weather.humidity
        rain = weather.rain_probability
        wind = weather.wind_speed

        cards.append(RecommendationCardItem(type="irrigation_advice", value="Skip irrigation" if rain > 50 else "Standard field irrigation schedule"))
        cards.append(RecommendationCardItem(type="spray_window", value="Favorable spray window (Wind < 15 km/h)" if wind < 15 else "Avoid spraying crops due to high drift wind"))
        cards.append(RecommendationCardItem(type="evapotranspiration", value=f"Evaporation Rate: High ({temp}°C / {humidity}% RH)"))

        if rain > 60:
            priority = "high"
            headline = "Heavy Rainfall Agricultural Warning"
            message_key = "personalization.agriculture.rain_irrigation"
            message = f"High rainfall probability ({rain}%). Pause planned field spraying or fertilizer application to prevent chemical runoff."
        elif wind > 25:
            priority = "medium"
            headline = "High Wind Drift Warning for Crop Spraying"
            message_key = "personalization.agriculture.wind_drift"
            message = f"Wind speed of {wind} km/h causes pesticide drift. Postpone crop spraying operations."
        else:
            priority = "low"
            headline = "Favorable Farming Weather"
            message_key = "personalization.agriculture.good_harvest"
            message = "Weather conditions are optimal for harvesting, sowing, and standard farm operations."

    # 7. COMMUTERS PERSONA
    elif p_clean == "commuters":
        temp = weather.temperature
        rain = weather.rain_probability
        wind = weather.wind_speed
        cond = weather.condition

        cards.append(RecommendationCardItem(type="transit_impact", value="Low transit disruption risk"))
        cards.append(RecommendationCardItem(type="gear_reminder", value="Carry raincoat & waterproof bag" if rain > 35 else "No special rain gear needed"))
        cards.append(RecommendationCardItem(type="road_condition", value=f"Condition: {cond} | Wind: {wind} km/h"))

        if rain > 65 or "Thunderstorm" in cond:
            priority = "high"
            headline = "Commute Waterlogging & Delay Warning"
            message_key = "personalization.commuters.heavy_rain_delay"
            message = "Heavy rain/thunderstorms likely during peak travel hours. Drive cautiously, watch for slippery roads or traffic congestion, and carry umbrellas."
        elif wind > 35:
            priority = "medium"
            headline = "Strong Crosswind Alert for Two-Wheelers"
            message_key = "personalization.commuters.wind_hazard"
            message = f"Strong gusts ({wind} km/h) can affect motorcycle and bicycle stability. Ride carefully."
        else:
            priority = "low"
            headline = "Smooth Commute Conditions"
            message_key = "personalization.commuters.smooth_drive"
            message = "Clear roads and stable weather expected for your morning and evening commute."

    # 8. EVENT PLANNERS PERSONA
    elif p_clean == "event_planners":
        temp = weather.temperature
        rain = weather.rain_probability
        wind = weather.wind_speed

        cards.append(RecommendationCardItem(type="event_risk_index", value="Low risk (Outdoor tent setup secure)"))
        cards.append(RecommendationCardItem(type="precipitation_forecast", value=f"Rain Risk: {rain}%"))
        cards.append(RecommendationCardItem(type="wind_gust_advisory", value=f"Wind: {wind} km/h (Tent limit: 40 km/h)"))

        if rain > 50:
            priority = "high"
            headline = "High Rain Risk for Outdoor Events"
            message_key = "personalization.event_planners.rain_contingency"
            message = f"Significant rain probability ({rain}%). Deploy covered marquee tents, waterproof staging, and electrical protection."
        elif wind > 30:
            priority = "medium"
            headline = "Wind Gust Warning for Temporary Structures"
            message_key = "personalization.event_planners.wind_tent_safety"
            message = f"Wind gusts reaching {wind} km/h. Secure heavy ballasts for outdoor pop-up canopies and banners."
        else:
            priority = "low"
            headline = "Excellent Outdoor Event Weather"
            message_key = "personalization.event_planners.ideal_event"
            message = "Ideal temperature and dry conditions for weddings, sports, and outdoor public gatherings."

    return RecommendationResponse(
        persona=p_clean,
        headline=headline,
        message_key=message_key,
        message=message,
        priority=priority,
        cards=cards
    )
