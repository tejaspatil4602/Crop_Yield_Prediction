from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib
from weather_service import WeatherService
import os
from functools import lru_cache
from dotenv import load_dotenv
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO)

app = FastAPI()

@lru_cache()
def get_weather_service():
    api_key = os.getenv('WEATHER_API_KEY')
    if not api_key:
        logging.error("Weather API key not found in environment variables")
        raise HTTPException(status_code=500, detail="Weather API key not configured. Please check your .env file.")
    try:
        return WeatherService(api_key)
    except ValueError as e:
        logging.error(f"Invalid Weather API key: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionInput(BaseModel):
    location: str
    soil_quality: float
    fertilizer: float

# Load the trained model and scaler
model = joblib.load('crop_yield_model.joblib')
scaler = joblib.load('scaler.joblib')

@app.post("/predict")
def predict_crop_yield(input_data: PredictionInput, weather_service: WeatherService = Depends(get_weather_service)):
    try:
        # Get weather features
        weather_features = weather_service.prepare_weather_features(input_data.location)
        
        # Prepare features
        features = np.array([
            [weather_features['current_rainfall'],
             weather_features['current_temperature'],
             input_data.soil_quality,
             input_data.fertilizer]
        ])
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Make prediction
        prediction = model.predict(features_scaled)
        
        return {
            "predicted_yield": float(prediction[0]),
            "weather_data": weather_features
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}

class ChatInput(BaseModel):
    message: str

@app.post("/chat")
def chat(input_data: ChatInput):
    try:
        # Process the user's message and generate appropriate response
        message = input_data.message.lower()
        
        # Basic response logic based on keywords
        if 'yield' in message or 'prediction' in message:
            response = "I can help you predict crop yields. Please use the prediction form with your location, soil quality, and fertilizer information."
        elif 'weather' in message:
            response = "I can provide weather information when you make a yield prediction. The data includes rainfall and temperature."
        elif 'soil' in message or 'fertilizer' in message:
            response = "Soil quality and fertilizer usage are important factors in crop yield. Please rate soil quality from 1-10 and specify fertilizer amount in kg/hectare."
        else:
            response = "I'm your agricultural assistant. I can help with crop yield predictions, weather data, and farming advice. What would you like to know?"
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))