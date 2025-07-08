import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib

# Load datasets
rainfall_df = pd.read_csv('Rainfall.csv')
temp_df = pd.read_csv('avg temp.csv')
crop_data = pd.read_csv('crop_data.csv')
final_crop = pd.read_csv('final_crop.csv')

# Clean and preprocess rainfall data
rainfall_df = rainfall_df.dropna()
rainfall_df = rainfall_df.groupby(['Year', 'Dist Name'])['Total Rainfall'].mean().reset_index()

# Clean and preprocess temperature data
temp_df = temp_df.dropna()

# Merge datasets
merged_data = pd.merge(rainfall_df, temp_df, on=['Year'], how='inner')
merged_data = pd.merge(merged_data, crop_data, on=['Year'], how='inner')

# Feature engineering
X = merged_data[['Total Rainfall', 'Temperature', 'Soil_Quality', 'Fertilizer_Used']]
y = merged_data['Crop_Yield']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Save the model and scaler
joblib.dump(model, 'crop_yield_model.joblib')
joblib.dump(scaler, 'scaler.joblib')

# Create prediction function
def predict_yield(rainfall, temperature, soil_quality, fertilizer):
    features = np.array([[rainfall, temperature, soil_quality, fertilizer]])
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)
    return prediction[0]