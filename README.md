# Crop Yield Prediction System

## Overview
The Crop Yield Prediction System is an advanced web application that leverages machine learning to predict crop yields based on various environmental and agricultural parameters. This system helps farmers and agricultural professionals make data-driven decisions for optimal crop management.

## Features
- **Intelligent Prediction Engine**: Advanced ML model for accurate crop yield predictions
- **User Authentication**: Secure login and registration system
- **Interactive Dashboard**: User-friendly interface for input parameters and results
- **Historical Data Tracking**: Store and view past predictions
- **PDF Report Generation**: Download detailed prediction reports
- **Weather Integration**: Real-time weather data incorporation
- **Responsive Design**: Works seamlessly across devices

## Tech Stack
### Frontend
- React.js with Vite
- Material-UI (MUI) for components
- PDF generation with @react-pdf/renderer
- Tailwind CSS for styling

### Backend
- FastAPI (Python)
- Node.js with Express
- MongoDB for data storage
- JWT for authentication

### Machine Learning
- PyTorch for model training
- Scikit-learn for data preprocessing
- Joblib for model serialization

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB

### Frontend Setup
1. Clone the repository
   ```bash
   git clone [repository-url]
   cd crop-yield-prediction
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create .env file
   ```env
   VITE_API_URL=http://localhost:5001
   ```

4. Start development server
   ```bash
   npm run dev
   ```

### Backend Setup
1. Install Python dependencies
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the FastAPI server
   ```bash
   python app.py
   ```

4. Start the Node.js server
   ```bash
   cd backend
   npm install
   npm start
   ```

## Project Structure
```
├── src/                  # Frontend React components
│   ├── components/       # React components
│   ├── assets/          # Static assets
│   ├── lib/             # Utility functions
│   └── styles/          # CSS styles
├── backend/             # Node.js backend
│   ├── routes/          # API routes
│   └── db.js            # Database configuration
├── app.py               # FastAPI backend server
├── model.py             # ML model definitions
├── weather_service.py   # Weather data integration
└── requirements.txt     # Python dependencies
```

## Usage
1. Register/Login to access the system
2. Navigate to the prediction page
3. Enter crop and environmental parameters
4. Get instant yield predictions
5. View prediction history
6. Download detailed PDF reports

## API Endpoints
- `/api/auth/*` - Authentication endpoints
- `/api/predictions/*` - Prediction management
- `/api/weather/*` - Weather data integration

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support, please open an issue in the repository or contact the development team.