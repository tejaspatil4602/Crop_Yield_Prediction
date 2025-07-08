import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import KFold
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

# Set random seeds
torch.manual_seed(42)
np.random.seed(42)

# Load datasets
rainfall_df = pd.read_csv('data/Rainfall.csv')
temp_df = pd.read_csv('data/avg temp.csv')
crop_data = pd.read_csv('data/crop_data.csv')
final_crop = pd.read_csv('data/final_crop.csv')
crop_recommendation = pd.read_csv('data/Crop_recommendation.csv')

# Clean rainfall data
rainfall_df = rainfall_df[rainfall_df['Total Rainfall'] >= 0]
rainfall_df = rainfall_df.groupby(['Year', 'Dist Name'])['Total Rainfall'].mean().reset_index()

# Clean temperature data
temp_df = temp_df.dropna()

# Merge datasets
merged_data = pd.merge(rainfall_df, temp_df, on=['Year', 'Dist Name'], how='inner')
merged_data = pd.merge(merged_data, final_crop[['Year', 'Dist Name', 'Crop', 'Area(1000 ha)', 'Yield(Kg per ha)']], 
                      on=['Year', 'Dist Name'], how='inner')

# Encode categorical variables
le_dist = LabelEncoder()
le_crop = LabelEncoder()
merged_data['Dist Name'] = le_dist.fit_transform(merged_data['Dist Name'])
merged_data['Crop'] = le_crop.fit_transform(merged_data['Crop'])

# Feature engineering
merged_data['Year_encoded'] = merged_data['Year'] - merged_data['Year'].min()
merged_data['Season'] = np.where(merged_data['Year_encoded'] % 2 == 0, 1, 0)  # Alternate seasons

# Create advanced features
merged_data['Rainfall_Temp'] = merged_data['Total Rainfall'] * merged_data['Avg Temp']
merged_data['Area_Normalized'] = merged_data['Area(1000 ha)'] / merged_data['Area(1000 ha)'].max()
merged_data['Temp_Square'] = merged_data['Avg Temp'] ** 2
merged_data['Rainfall_Square'] = merged_data['Total Rainfall'] ** 2

# Add soil and nutrient features from crop recommendation data
# First encode the crop labels consistently
common_crops = set(merged_data['Crop'].unique())
avg_nutrients = crop_recommendation.copy()
avg_nutrients['label'] = le_crop.fit_transform(avg_nutrients['label'])

# Calculate average nutrients per crop
avg_nutrients = avg_nutrients.groupby('label').agg({
    'N': 'mean',
    'P': 'mean',
    'K': 'mean',
    'humidity': 'mean',
    'ph': 'mean'
}).reset_index()

# Merge with main dataset
merged_data = pd.merge(
    merged_data,
    avg_nutrients,
    left_on='Crop',
    right_on='label',
    how='left'
)

# Fill missing values with means
for col in ['N', 'P', 'K', 'humidity', 'ph']:
    merged_data[col].fillna(merged_data[col].mean(), inplace=True)

# Final feature selection
feature_columns = [
    'Total Rainfall', 'Avg Temp', 'Year_encoded', 'Season',
    'Rainfall_Temp', 'Area_Normalized', 'Temp_Square', 'Rainfall_Square',
    'N', 'P', 'K', 'humidity', 'ph', 'Dist Name', 'Crop'
]

# Normalize features
scaler = StandardScaler()
X = merged_data[feature_columns]
y = merged_data['Yield(Kg per ha)']

# Define the neural network model
class ResidualBlock(nn.Module):
    def __init__(self, in_features, out_features):
        super(ResidualBlock, self).__init__()
        self.fc1 = nn.Linear(in_features, out_features)
        self.bn1 = nn.BatchNorm1d(out_features)
        self.fc2 = nn.Linear(out_features, out_features)
        self.bn2 = nn.BatchNorm1d(out_features)
        self.relu = nn.LeakyReLU(0.2)
        self.dropout = nn.Dropout(0.4)
        
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

class SelfAttention(nn.Module):
    def __init__(self, embed_size):
        super(SelfAttention, self).__init__()
        self.embed_size = embed_size
        self.query = nn.Linear(embed_size, embed_size)
        self.key = nn.Linear(embed_size, embed_size)
        self.value = nn.Linear(embed_size, embed_size)
        self.scale = torch.sqrt(torch.FloatTensor([embed_size])).to(device)
        
    def forward(self, x):
        batch_size = x.shape[0]
        Q = self.query(x)
        K = self.key(x)
        V = self.value(x)
        
        attention = torch.matmul(Q, K.transpose(-2, -1)) / self.scale
        attention = torch.softmax(attention, dim=-1)
        x = torch.matmul(attention, V)
        return x

class CropYieldModel(nn.Module):
    def __init__(self, input_size):
        super(CropYieldModel, self).__init__()
        
        # Initial layer with increased capacity
        self.input_layer = nn.Sequential(
            nn.Linear(input_size, 512),
            nn.BatchNorm1d(512),
            nn.GELU(),
            nn.Dropout(0.4)
        )
        
        # Residual blocks
        self.res1 = ResidualBlock(512, 256)
        self.res2 = ResidualBlock(256, 128)
        self.res3 = ResidualBlock(128, 64)
        
        # Self-attention mechanism
        self.attention = SelfAttention(64)
        self.attention_norm = nn.LayerNorm(64)
        
        # Output layers
        self.output_layer = nn.Sequential(
            nn.Linear(64, 32),
            nn.LayerNorm(32),
            nn.GELU(),
            nn.Dropout(0.3),
            nn.Linear(32, 1)
        )

    def forward(self, x):
        # Initial processing
        x = self.input_layer(x)
        
        # Residual blocks
        x = self.res1(x)
        x = self.res2(x)
        x = self.res3(x)
        
        # Self-attention
        x = x.unsqueeze(1)  # Add sequence dimension
        x = self.attention(x)
        x = x.squeeze(1)    # Remove sequence dimension
        x = self.attention_norm(x)
        
        # Output
        x = self.output_layer(x)
        return x

# Training function
def train_model(model, train_loader, criterion, optimizer, device):
    model.train()
    total_loss = 0
    for X_batch, y_batch in train_loader:
        X_batch, y_batch = X_batch.to(device), y_batch.to(device)
        optimizer.zero_grad()
        output = model(X_batch)
        loss = criterion(output, y_batch)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    return total_loss

# Validation function
def validate_model(model, val_loader, criterion, device):
    model.eval()
    total_loss = 0
    predictions = []
    actuals = []
    with torch.no_grad():
        for X_batch, y_batch in val_loader:
            X_batch, y_batch = X_batch.to(device), y_batch.to(device)
            output = model(X_batch)
            loss = criterion(output, y_batch)
            total_loss += loss.item()
            predictions.extend(output.cpu().numpy())
            actuals.extend(y_batch.cpu().numpy())
    return total_loss, predictions, actuals

# Implement k-fold cross validation
k_folds = 5
kf = KFold(n_splits=k_folds, shuffle=True, random_state=42)

# Training parameters
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
epochs = 100
batch_size = 32
learning_rate = 0.001

# Store results
fold_results = []

for fold, (train_idx, val_idx) in enumerate(kf.split(X)):
    print(f'Fold {fold + 1}/{k_folds}')
    
    # Prepare data for current fold
    X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
    y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]
    
    # Scale features
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)
    
    # Create datasets and dataloaders
    train_dataset = torch.utils.data.TensorDataset(
        torch.FloatTensor(X_train_scaled),
        torch.FloatTensor(y_train.values.reshape(-1, 1))
    )
    val_dataset = torch.utils.data.TensorDataset(
        torch.FloatTensor(X_val_scaled),
        torch.FloatTensor(y_val.values.reshape(-1, 1))
    )
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size)
    
    # Initialize model and training components
    model = CropYieldModel(len(feature_columns)).to(device)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=5)
    
    # Training loop
    best_val_loss = float('inf')
    train_losses = []
    val_losses = []
    
    for epoch in range(epochs):
        train_loss = train_model(model, train_loader, criterion, optimizer, device)
        val_loss, predictions, actuals = validate_model(model, val_loader, criterion, device)
        
        train_losses.append(train_loss)
        val_losses.append(val_loss)
        
        scheduler.step(val_loss)
        
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), f'best_model_fold_{fold+1}.pth')
        
        if (epoch + 1) % 10 == 0:
            print(f'Epoch [{epoch+1}/{epochs}], Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}')
    
    # Calculate metrics for this fold
    final_predictions = np.array(predictions).flatten()
    final_actuals = np.array(actuals).flatten()
    mse = mean_squared_error(final_actuals, final_predictions)
    r2 = r2_score(final_actuals, final_predictions)
    
    fold_results.append({
        'fold': fold + 1,
        'mse': mse,
        'r2': r2,
        'train_losses': train_losses,
        'val_losses': val_losses
    })
    
    # Plot loss curves
    plt.figure(figsize=(10, 6))
    plt.plot(train_losses, label='Training Loss')
    plt.plot(val_losses, label='Validation Loss')
    plt.title(f'Loss Curves - Fold {fold+1}')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.savefig(f'loss_plot_fold_{fold+1}.png')
    plt.close()

# Print average results
print('\nAverage Results Across All Folds:')
print(f'MSE: {np.mean([r["mse"] for r in fold_results]):.4f}')
print(f'R2 Score: {np.mean([r["r2"] for r in fold_results]):.4f}')