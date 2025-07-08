import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import matplotlib.pyplot as plt

# Set random seeds for reproducibility
torch.manual_seed(42)
np.random.seed(42)

# Load and preprocess datasets
rainfall_df = pd.read_csv('Rainfall.csv')
temp_df = pd.read_csv('avg temp.csv')
crop_data = pd.read_csv('crop_data.csv')
final_crop = pd.read_csv('final_crop.csv')

# Clean rainfall data
rainfall_df = rainfall_df[rainfall_df['Total Rainfall'] >= 0]  # Remove negative rainfall values
rainfall_df = rainfall_df.groupby(['Year', 'Dist Name'])['Total Rainfall'].mean().reset_index()

# Clean temperature data
temp_df = temp_df.dropna()

# Ensure common keys exist in all datasets
common_years = set(rainfall_df['Year']).intersection(temp_df['Year']).intersection(final_crop['Year'])
rainfall_df = rainfall_df[rainfall_df['Year'].isin(common_years)]
temp_df = temp_df[temp_df['Year'].isin(common_years)]
final_crop = final_crop[final_crop['Year'].isin(common_years)]

# Merge datasets
merged_data = pd.merge(rainfall_df, temp_df, on=['Year', 'Dist Name'], how='inner')
merged_data = pd.merge(merged_data, final_crop[['Year', 'Dist Name', 'Crop', 'Yield(Kg per ha)']], 
                      on=['Year', 'Dist Name'], how='inner')

# Encode categorical variables
le = LabelEncoder()
merged_data['Dist Name'] = le.fit_transform(merged_data['Dist Name'])
merged_data['Crop'] = le.fit_transform(merged_data['Crop'])
merged_data['Crop'] = merged_data['Crop'].astype(str)

# Load additional datasets
crop_recommendation = pd.read_csv('Crop_recommendation.csv')

# Feature engineering
merged_data['Year_encoded'] = merged_data['Year'] - merged_data['Year'].min()
merged_data['Month'] = 6  # Assuming mid-year for crop data
merged_data['Season'] = np.where(merged_data['Month'].between(3, 8), 1, 0)  # 1 for summer, 0 for winter

# Create interaction features
merged_data['Rainfall_Temp'] = merged_data['Total Rainfall'] * merged_data['Avg Temp']
merged_data['Rainfall_Season'] = merged_data['Total Rainfall'] * merged_data['Season']

# Merge with crop recommendation data
merged_data = pd.merge(merged_data, crop_recommendation[['label', 'N', 'P', 'K', 'temperature', 'humidity', 'ph']], 
                      left_on='Crop', right_on='label', how='left')

# Enhanced feature engineering
feature_columns = [
    'Total Rainfall', 'Avg Temp', 'Year_encoded', 'Season',
    'Rainfall_Temp', 'Rainfall_Season', 'N', 'P', 'K',
    'temperature', 'humidity', 'ph', 'Dist Name', 'Crop'
]

# Advanced feature engineering
merged_data['Temp_Square'] = merged_data['Avg Temp'] ** 2
merged_data['Rainfall_Square'] = merged_data['Total Rainfall'] ** 2
merged_data['Temp_Cube'] = merged_data['Avg Temp'] ** 3
merged_data['Rainfall_Cube'] = merged_data['Total Rainfall'] ** 3
merged_data['NPK_Interaction'] = merged_data['N'] * merged_data['P'] * merged_data['K']
merged_data['NPK_Ratio'] = (merged_data['N'] + merged_data['P'] + merged_data['K']) / 3
merged_data['Temp_Rainfall_Ratio'] = merged_data['Avg Temp'] / (merged_data['Total Rainfall'] + 1)
merged_data['Growing_Index'] = (merged_data['temperature'] * 0.4 + 
                               merged_data['humidity'] * 0.3 + 
                               merged_data['Total Rainfall'] * 0.3) / \
                              (merged_data['Avg Temp'] + 1)
merged_data['Soil_Quality_Index'] = (merged_data['ph'] * 0.3 + 
                                    merged_data['humidity'] * 0.3 + 
                                    merged_data['NPK_Ratio'] * 0.4)

feature_columns.extend(['Temp_Square', 'Rainfall_Square', 'Temp_Cube', 'Rainfall_Cube',
                       'NPK_Interaction', 'NPK_Ratio', 'Temp_Rainfall_Ratio',
                       'Growing_Index', 'Soil_Quality_Index'])

# Normalize features individually
for column in feature_columns:
    if merged_data[column].dtype in ['int64', 'float64']:
        merged_data[column] = (merged_data[column] - merged_data[column].mean()) / merged_data[column].std()


X = merged_data[feature_columns]
y = merged_data['Yield(Kg per ha)']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
scaler_X = StandardScaler()
scaler_y = StandardScaler()

# Convert DataFrame to numpy array and scale
X_train_array = X_train.to_numpy()
X_test_array = X_test.to_numpy()

# Fit and transform
X_train_scaled = scaler_X.fit_transform(X_train_array)
X_test_scaled = scaler_X.transform(X_test_array)

# Convert target to numpy array and scale
y_train_array = y_train.to_numpy().reshape(-1, 1)
y_test_array = y_test.to_numpy().reshape(-1, 1)

# Scale target
y_train_scaled = scaler_y.fit_transform(y_train_array)
y_test_scaled = scaler_y.transform(y_test_array)

# Create PyTorch Dataset
class CropDataset(Dataset):
    def __init__(self, X, y):
        self.X = torch.FloatTensor(X)
        self.y = torch.FloatTensor(y)
    
    def __len__(self):
        return len(self.X)
    
    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

# Create data loaders
train_dataset = CropDataset(X_train_scaled, y_train_scaled)
test_dataset = CropDataset(X_test_scaled, y_test_scaled)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=32)

# Define the model
class ResidualBlock(nn.Module):
    def __init__(self, in_features, out_features):
        super(ResidualBlock, self).__init__()
        self.fc1 = nn.Linear(in_features, out_features)
        self.bn1 = nn.BatchNorm1d(out_features)
        self.fc2 = nn.Linear(out_features, out_features)
        self.bn2 = nn.BatchNorm1d(out_features)
        self.relu = nn.LeakyReLU(0.2)
        self.dropout = nn.Dropout(0.4)
        
        # Shortcut connection if dimensions don't match
        self.shortcut = nn.Sequential()
        if in_features != out_features:
            self.shortcut = nn.Sequential(
                nn.Linear(in_features, out_features),
                nn.BatchNorm1d(out_features)
            )
    
    def forward(self, x):
        identity = self.shortcut(x)
        out = self.fc1(x)
        out = self.bn1(out)
        out = self.relu(out)
        out = self.dropout(out)
        out = self.fc2(out)
        out = self.bn2(out)
        out += identity
        out = self.relu(out)
        return out

class CropYieldModel(nn.Module):
    def __init__(self, input_size):
        super(CropYieldModel, self).__init__()
        
        # Initial layer with increased capacity and regularization
        self.input_layer = nn.Sequential(
            nn.Linear(input_size, 2048),
            nn.BatchNorm1d(2048),
            nn.GELU(),
            nn.Dropout(0.4)
        )
        
        # Deeper residual network with skip connections
        self.res1 = ResidualBlock(2048, 1024)
        self.res2 = ResidualBlock(1024, 512)
        self.res3 = ResidualBlock(512, 256)
        self.res4 = ResidualBlock(256, 128)
        self.res5 = ResidualBlock(128, 64)
        
        # Multi-head self-attention mechanism
        self.attention = nn.MultiheadAttention(64, num_heads=4, batch_first=True)
        self.attention_norm = nn.LayerNorm(64)
        
        # Output layer with enhanced regularization
        self.output_layer = nn.Sequential(
            nn.Linear(64, 32),
            nn.LayerNorm(32),
            nn.GELU(),
            nn.Dropout(0.3),
            nn.Linear(32, 16),
            nn.LayerNorm(16),
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(16, 1)
        )
        
        # Weight initialization
        self.apply(self._init_weights)
    
    def _init_weights(self, m):
        if isinstance(m, nn.Linear):
            nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
            if m.bias is not None:
                nn.init.constant_(m.bias, 0)
    
    def forward(self, x):
        # Forward pass through main network
        x = self.input_layer(x)
        x = self.res1(x)
        x = self.res2(x)
        x = self.res3(x)
        x = self.res4(x)
        x = self.res5(x)
        
        # Reshape for attention (batch_size, sequence_length=1, hidden_size)
        x = x.unsqueeze(1)
        
        # Apply self-attention (using same tensor for query, key, value)
        attn_output, _ = self.attention(x, x, x)
        x = self.attention_norm(attn_output)
        x = x.squeeze(1)
        
        # Output layer
        out = self.output_layer(x)
        return out

# Initialize model with improved configuration
model = CropYieldModel(input_size=len(feature_columns))
# Combined loss function for better stability
criterion = lambda pred, target: (
    0.7 * nn.MSELoss()(pred, target) +
    0.3 * nn.SmoothL1Loss()(pred, target)
)
optimizer = torch.optim.AdamW(model.parameters(), lr=0.0005, weight_decay=1e-5, betas=(0.9, 0.999))

# Add gradient clipping
clip_value = 0.5
torch.nn.utils.clip_grad_norm_(model.parameters(), clip_value)

# Advanced learning rate scheduler with cosine annealing
warmup_epochs = 10
scheduler = torch.optim.lr_scheduler.CosineAnnealingWarmRestarts(
    optimizer,
    T_0=20,  # First restart cycle length
    T_mult=2,  # Cycle length multiplier
    eta_min=1e-6  # Minimum learning rate
)

# K-fold cross validation
from sklearn.model_selection import KFold
k_folds = 5
kf = KFold(n_splits=k_folds, shuffle=True, random_state=42)

# Training with cross-validation
for fold, (train_idx, val_idx) in enumerate(kf.split(X_train_scaled)):
    print(f'Fold {fold + 1}/{k_folds}')
    
    # Prepare fold data
    X_train_fold = torch.FloatTensor(X_train_scaled[train_idx])
    y_train_fold = torch.FloatTensor(y_train_scaled[train_idx])
    X_val_fold = torch.FloatTensor(X_train_scaled[val_idx])
    y_val_fold = torch.FloatTensor(y_train_scaled[val_idx])
    
    train_dataset = CropDataset(X_train_fold, y_train_fold)
    val_dataset = CropDataset(X_val_fold, y_val_fold)
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32)

# Training loop with cross-validation and improved learning rate scheduling
num_epochs = 500
best_models = []
fold_scores = []

for fold, (train_idx, val_idx) in enumerate(kf.split(X_train_scaled)):
    print(f'\nFold {fold + 1}/{k_folds}')
    
    # Initialize model and optimizer for this fold
    fold_model = CropYieldModel(input_size=len(feature_columns))
    fold_optimizer = torch.optim.AdamW(fold_model.parameters(), lr=0.001, weight_decay=1e-4, betas=(0.9, 0.999))
    
    # One cycle learning rate scheduler
    fold_scheduler = torch.optim.lr_scheduler.OneCycleLR(
        fold_optimizer,
        max_lr=0.01,
        epochs=num_epochs,
        steps_per_epoch=len(train_loader),
        pct_start=0.3,
        anneal_strategy='cos',
        div_factor=25.0,
        final_div_factor=1000.0
    )
    
    # Training variables
    train_losses = []
    val_losses = []
    best_loss = float('inf')
    patience = 20
    patience_counter = 0
    
    # Prepare fold data
    X_train_fold = torch.FloatTensor(X_train_scaled[train_idx])
    y_train_fold = torch.FloatTensor(y_train_scaled[train_idx])
    X_val_fold = torch.FloatTensor(X_train_scaled[val_idx])
    y_val_fold = torch.FloatTensor(y_train_scaled[val_idx])
    
    train_dataset = CropDataset(X_train_fold, y_train_fold)
    val_dataset = CropDataset(X_val_fold, y_val_fold)
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32)
    
    for epoch in range(num_epochs):
        # Training phase
        fold_model.train()
        train_loss = 0
        for batch_X, batch_y in train_loader:
            fold_optimizer.zero_grad()
            outputs = fold_model(batch_X)
            loss = criterion(outputs, batch_y)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(fold_model.parameters(), clip_value)
            fold_optimizer.step()
            train_loss += loss.item()
        
        # Validation phase
        fold_model.eval()
        val_loss = 0
        with torch.no_grad():
            for batch_X, batch_y in val_loader:
                outputs = fold_model(batch_X)
                outputs = torch.nan_to_num(outputs, nan=0.0)
                loss = criterion(outputs, batch_y)
                val_loss += loss.item()
        
        # Calculate average losses
        avg_train_loss = train_loss/len(train_loader)
        avg_val_loss = val_loss/len(val_loader)
        train_losses.append(avg_train_loss)
        val_losses.append(avg_val_loss)
        
        # Learning rate scheduling
        fold_scheduler.step()
        
        # Early stopping and model checkpointing
        if avg_val_loss < best_loss:
            best_loss = avg_val_loss
            patience_counter = 0
            # Save best model for this fold
            best_model_path = f'best_model_fold_{fold+1}.pth'
            torch.save({
                'fold': fold + 1,
                'epoch': epoch,
                'model_state_dict': fold_model.state_dict(),
                'optimizer_state_dict': fold_optimizer.state_dict(),
                'loss': best_loss,
            }, best_model_path)
            best_models.append(best_model_path)
        else:
            patience_counter += 1
        
        if patience_counter >= patience:
            print(f'Early stopping triggered at epoch {epoch+1}')
            break
        
        if (epoch + 1) % 10 == 0:
            print(f'Epoch [{epoch+1}/{num_epochs}], '
                  f'Train Loss: {avg_train_loss:.4f}, '
                  f'Val Loss: {avg_val_loss:.4f}')
    
    fold_scores.append(best_loss)
    print(f'Fold {fold + 1} Best Loss: {best_loss:.4f}')

# Calculate and print cross-validation results
print(f'\nCross-validation mean loss: {np.mean(fold_scores):.4f} ± {np.std(fold_scores):.4f}')

# Plot training and validation loss for each fold
for fold in range(k_folds):
    plt.figure(figsize=(10, 6))
    plt.plot(train_losses, label='Training Loss')
    plt.plot(val_losses, label='Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.title(f'Training and Validation Loss - Fold {fold + 1}')
    plt.legend()
    plt.savefig(f'loss_plot_fold_{fold + 1}.png')
    plt.close()

# Ensemble prediction using all fold models
model_predictions = []
for model_path in best_models:
    # Load model
    checkpoint = torch.load(model_path)
    fold_model = CropYieldModel(input_size=len(feature_columns))
    fold_model.load_state_dict(checkpoint['model_state_dict'])
    fold_model.eval()
    
    # Get predictions
    with torch.no_grad():
        y_pred_scaled = fold_model(torch.FloatTensor(X_test_scaled))
        y_pred_scaled = torch.nan_to_num(y_pred_scaled, nan=0.0).numpy()
        y_pred = scaler_y.inverse_transform(y_pred_scaled)
        model_predictions.append(y_pred)

# Average predictions from all models
y_pred_ensemble = np.mean(model_predictions, axis=0)

# Calculate metrics for ensemble predictions
mse = mean_squared_error(y_test, y_pred_ensemble)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred_ensemble)
r2 = r2_score(y_test, y_pred_ensemble)

print('\nEnsemble Model Evaluation Metrics:')
print(f'Mean Squared Error: {mse:.2f}')
print(f'Root Mean Squared Error: {rmse:.2f}')
print(f'Mean Absolute Error: {mae:.2f}')
print(f'R2 Score: {r2:.2f}')

# Save the best performing model and scalers
best_fold_idx = np.argmin(fold_scores)
best_model_path = best_models[best_fold_idx]
checkpoint = torch.load(best_model_path)

torch.save({
    'model_state_dict': checkpoint['model_state_dict'],
    'fold_scores': fold_scores,
    'best_fold': best_fold_idx + 1,
    'scaler_X': scaler_X,
    'scaler_y': scaler_y,
    'label_encoder': le,
    'feature_columns': feature_columns
}, 'crop_yield_model.pth')

print('\nEnsemble model evaluation and best model saved successfully!')

# Clean up individual fold models
for model_path in best_models:
    if model_path != best_model_path:  # Keep the best model
        import os
        os.remove(model_path)