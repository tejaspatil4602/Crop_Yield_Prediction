import requests
import pandas as pd
import numpy as np
from datetime import datetime

class WeatherService:
    def __init__(self, api_key):
        if not api_key or not isinstance(api_key, str) or len(api_key.strip()) == 0:
            raise ValueError("Invalid Weather API key provided")
        self.api_key = api_key.strip()
        self.base_url = "http://api.weatherapi.com/v1"
    
    def get_current_weather(self, location):
        """Fetch current weather data for a given location"""
        try:
            url = f"{self.base_url}/current.json?key={self.api_key}&q={location}"
            response = requests.get(url)
            data = response.json()
            
            if response.status_code == 200:
                return {
                    'temperature': data['current']['temp_c'],
                    'rainfall': data['current']['precip_mm'],
                    'humidity': data['current']['humidity'],
                    'timestamp': datetime.now().isoformat()
                }
            else:
                raise Exception(f"Error fetching weather data: {data['error']['message']}")
        except Exception as e:
            raise Exception(f"Weather API error: {str(e)}")
    
    def get_historical_weather(self, location, days=7):
        """Fetch historical weather data for training"""
        try:
            url = f"{self.base_url}/history.json?key={self.api_key}&q={location}&days={days}"
            response = requests.get(url)
            data = response.json()
            
            if response.status_code == 200:
                historical_data = []
                for day in data['forecast']['forecastday']:
                    historical_data.append({
                        'date': day['date'],
                        'temperature': day['day']['avgtemp_c'],
                        'rainfall': day['day']['totalprecip_mm'],
                        'humidity': day['day']['avghumidity']
                    })
                return pd.DataFrame(historical_data)
            else:
                raise Exception(f"Error fetching historical data: {data['error']['message']}")
        except Exception as e:
            raise Exception(f"Weather API error: {str(e)}")
    
    def prepare_weather_features(self, location):
        """Prepare weather features for prediction"""
        current_weather = self.get_current_weather(location)
        historical_weather = self.get_historical_weather(location)
        
        # Combine current and historical data
        features = {
            'current_temperature': current_weather['temperature'],
            'current_rainfall': current_weather['rainfall'],
            'avg_temp_7days': historical_weather['temperature'].mean(),
            'total_rainfall_7days': historical_weather['rainfall'].sum(),
            'avg_humidity_7days': historical_weather['humidity'].mean()
        }
        
        return features