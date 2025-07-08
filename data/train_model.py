import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
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
merged_data = pd.merge(rainfall_df, temp_df, on=['Year', 'Dist Name'], how='inner')
merged_data = pd.merge(merged_data, final_crop[['Year', 'Dist Name', 'Yield(Kg per ha)']], 
                      on=['Year', 'Dist Name'], how='inner')

# Add synthetic data for soil quality and fertilizer usage
np.random.seed(42)
merged_data['Soil_Quality'] = np.random.uniform(5, 9, size=len(merged_data))  # Scale of 1-10
merged_data['Fertilizer_Used'] = np.random.uniform(100, 500, size=len(merged_data))  # kg/ha

# Feature engineering
X = merged_data[['Total Rainfall', 'Avg Temp', 'Soil_Quality', 'Fertilizer_Used']]
y = merged_data['Yield(Kg per ha)']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Evaluate the model
y_pred = model.predict(X_test_scaled)
print('Mean Squared Error:', mean_squared_error(y_test, y_pred))
print('R2 Score:', r2_score(y_test, y_pred))

# Save the model and scaler
joblib.dump(model, 'crop_yield_model.joblib')
joblib.dump(scaler, 'scaler.joblib')

print('Model and scaler saved successfully!')