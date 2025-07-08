import { useState } from 'react';
import PredictionReport from './PredictionReport';
import './Prediction.css';
import { WaterDrop, Thermostat, Landscape, Opacity, Science, CalendarToday, LocationOn, Grass, Agriculture } from '@mui/icons-material';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

// Simple prediction model coefficients (for demonstration)
const MODEL_COEFFICIENTS = {
  rainfall: 2.5,
  temperature: -150,
  soil_quality: 300,
  fertilizer: 0.5,
  base: 2000
};

const SEASONS = ['Rabi', 'Kharif', 'Zaid'];
const CROP_TYPES = ['Rice', 'Wheat', 'Corn', 'Sugarcane', 'Cotton'];
const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert'];
const DISTRICTS = ['Ahmednagar', 'Akola', 'Amarawati', 'Aurangabad', 'Beed', 'Bhandara', 'Bombay', 'Buldhana', 'Chandrapur', 'Dhule', 'Jalgaon', 'Kolhapur', 'Nagpur'];

const Prediction = () => {
  const [formData, setFormData] = useState({
    district_name: '',
    crop_year: '',
    season: '',
    crop_type: '',
    area: '',
    temperature: '',
    wind_speed: '',
    precipitation: '',
    humidity: '',
    soil_type: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    pressure: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, crop_year: date.getFullYear().toString() }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculatePrediction = (data) => {
    // Ensure all numeric inputs are valid
    const numericInputs = {
      temperature: parseFloat(data.temperature) || 0,
      humidity: parseFloat(data.humidity) || 0,
      precipitation: parseFloat(data.precipitation) || 0,
      wind_speed: parseFloat(data.wind_speed) || 0,
      nitrogen: parseFloat(data.nitrogen) || 0,
      phosphorus: parseFloat(data.phosphorus) || 0,
      potassium: parseFloat(data.potassium) || 0,
      pressure: parseFloat(data.pressure) || 0,
      area: parseFloat(data.area) || 0
    };

    // Validate crop type
    const cropMultiplier = {
      rice: 1.2,
      wheat: 1.1,
      corn: 1.15
    }[data.crop_type?.toLowerCase()] || 1;

    // Calculate base yield (simplified model)
    const baseYield = MODEL_COEFFICIENTS.base +
      (numericInputs.temperature * MODEL_COEFFICIENTS.temperature) +
      (numericInputs.humidity * (MODEL_COEFFICIENTS.soil_quality / 2)) +
      (numericInputs.precipitation * MODEL_COEFFICIENTS.rainfall);

    // Apply crop multiplier and ensure non-negative result
    return Math.max(0, baseYield * cropMultiplier);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShowReport(false);

    try {
      // Input validation
      const inputs = {
        crop_type: formData.crop_type?.trim(),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        district_name: formData.district_name?.trim(),
        crop_year: formData.crop_year?.trim(),
        season: formData.season?.trim(),
        area: parseFloat(formData.area),
        wind_speed: parseFloat(formData.wind_speed),
        precipitation: parseFloat(formData.precipitation),
        soil_type: formData.soil_type?.trim(),
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        pressure: parseFloat(formData.pressure)
      };
      
      // Validate required fields
      const requiredFields = ['crop_type', 'district_name', 'crop_year', 'season', 'soil_type'];
      const missingFields = requiredFields.filter(field => !inputs[field]);
      if (missingFields.length > 0) {
        throw new Error(`Please enter all required fields: ${missingFields.join(', ')}`);
      }

      // Validate numeric fields
      const numericFields = ['temperature', 'humidity', 'area', 'wind_speed', 'precipitation', 'nitrogen', 'phosphorus', 'potassium', 'pressure'];
      const invalidFields = numericFields.filter(field => isNaN(parseFloat(inputs[field])));
      
      if (invalidFields.length > 0) {
        throw new Error(`Please enter valid numbers for: ${invalidFields.join(', ')}`);
      }

      // Convert numeric fields to float
      numericFields.forEach(field => {
        inputs[field] = parseFloat(inputs[field]);
      });

      // Validate ranges
      if (inputs.humidity < 0 || inputs.humidity > 100) {
        throw new Error('Humidity must be between 0 and 100');
      }
      if (inputs.temperature < -50 || inputs.temperature > 60) {
        throw new Error('Temperature must be between -50°C and 60°C');
      }
      if (inputs.area <= 0) {
        throw new Error('Area must be greater than 0');
      }
      if (inputs.nitrogen < 0 || inputs.nitrogen > 140) {
        throw new Error('Nitrogen must be between 0 and 140');
      }
      if (inputs.phosphorus < 0 || inputs.phosphorus > 145) {
        throw new Error('Phosphorus must be between 0 and 145');
      }
      if (inputs.potassium < 0 || inputs.potassium > 205) {
        throw new Error('Potassium must be between 0 and 205');
      }
      if (inputs.pressure < 0 || inputs.pressure > 14) {
        throw new Error('pH must be between 0 and 14');
      }
      if (inputs.precipitation < 0) {
        throw new Error('Precipitation cannot be negative');
      }
      if (inputs.wind_speed < 0) {
        throw new Error('Wind speed cannot be negative');
      }

      // Calculate prediction
      const predictedYield = calculatePrediction(inputs);
      setPrediction(predictedYield);
      setShowReport(true);
      
      // Get authentication info
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      // Validate authentication before proceeding
      if (!authToken || !userId) {
        setError('Please log in to save predictions');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      try {
        const predictionData = {
            userId: userId,
            cropType: inputs.crop_type,
            area: inputs.area,
            soilType: inputs.soil_type,
            temperature: inputs.temperature,
            humidity: inputs.humidity,
            rainfall: inputs.precipitation,
            nitrogen: inputs.nitrogen,
            phosphorus: inputs.phosphorus,
            potassium: inputs.potassium,
            ph: inputs.pressure,
            predictedYield
          };

          const response = await fetch('http://localhost:5002/api/predictions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(predictionData)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save prediction');
          }

          const savedPrediction = await response.json();
          console.log('Prediction saved successfully:', savedPrediction);
          alert('Prediction saved successfully!');
        } catch (saveError) {
          console.error('Failed to save prediction:', saveError);
          
          const isAuthError = saveError.response?.status === 401 || 
                             saveError.message.includes('authentication') || 
                             saveError.message.includes('login');

          if (isAuthError) {
            setError('Your session has expired. Please log in again.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else {
            setError('Failed to save prediction: ' + saveError.message);
          }
        }
      
      // Pass complete form data to PredictionReport
      const reportData = {
        ...inputs,
        predicted_yield: predictedYield
      };
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prediction-container">
      <div className="prediction-header">
        <h1>Crop Yield Prediction</h1>
        <p>Enter your crop parameters to predict the yield</p>
      </div>

      <div className="prediction-card">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group">
            <LocationOn className="input-icon" />
            <FormControl fullWidth>
              <InputLabel id="district-label">District Name</InputLabel>
              <Select
                labelId="district-label"
                id="district_name"
                name="district_name"
                value={formData.district_name}
                onChange={handleSelectChange}
                required
              >
                {DISTRICTS.map((district) => (
                  <MenuItem key={district} value={district}>{district}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="input-group">
            <CalendarToday className="input-icon" />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Crop Year"
                value={formData.crop_year ? new Date(formData.crop_year) : null}
                onChange={handleDateChange}
                views={['year']}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>
          </div>

          <div className="input-group">
            <Grass className="input-icon" />
            <FormControl fullWidth>
              <InputLabel id="season-label">Season</InputLabel>
              <Select
                labelId="season-label"
                id="season"
                name="season"
                value={formData.season}
                onChange={handleSelectChange}
                required
              >
                {SEASONS.map((season) => (
                  <MenuItem key={season} value={season}>{season}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="input-group">
            <Agriculture className="input-icon" />
            <FormControl fullWidth>
              <InputLabel id="crop-type-label">Crop Type</InputLabel>
              <Select
                labelId="crop-type-label"
                id="crop_type"
                name="crop_type"
                value={formData.crop_type}
                onChange={handleSelectChange}
                required
              >
                {CROP_TYPES.map((crop) => (
                  <MenuItem key={crop} value={crop}>{crop}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="area">Area (hectares)</label>
            <input
              id="area"
              type="number"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              min="0"
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="temperature">Temperature (°C)</label>
            <input
              id="temperature"
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              min="-20"
              max="50"
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="wind_speed">Wind Speed (km/h)</label>
            <input
              id="wind_speed"
              type="number"
              name="wind_speed"
              value={formData.wind_speed}
              onChange={handleInputChange}
              min="0"
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="precipitation">Precipitation (mm)</label>
            <input
              id="precipitation"
              type="number"
              name="precipitation"
              value={formData.precipitation}
              onChange={handleInputChange}
              min="0"
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="humidity">Humidity (%)</label>
            <input
              id="humidity"
              type="number"
              name="humidity"
              value={formData.humidity}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <Landscape className="input-icon" />
            <FormControl fullWidth>
              <InputLabel id="soil-type-label">Soil Type</InputLabel>
              <Select
                labelId="soil-type-label"
                id="soil_type"
                name="soil_type"
                value={formData.soil_type}
                onChange={handleSelectChange}
                required
              >
                {SOIL_TYPES.map((soil) => (
                  <MenuItem key={soil} value={soil}>{soil}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="nitrogen">Nitrogen (N)</label>
            <input
              id="nitrogen"
              type="number"
              name="nitrogen"
              value={formData.nitrogen}
              onChange={handleInputChange}
              min="0"
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="phosphorus">Phosphorus (P)</label>
            <input
              id="phosphorus"
              type="number"
              name="phosphorus"
              value={formData.phosphorus}
              onChange={handleInputChange}
              min="0"
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="potassium">Potassium (K)</label>
            <input
              id="potassium"
              type="number"
              name="potassium"
              value={formData.potassium}
              onChange={handleInputChange}
              min="0"
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="pressure">Pressure (hPa)</label>
            <input
              id="pressure"
              type="number"
              name="pressure"
              value={formData.pressure}
              onChange={handleInputChange}
              min="0"
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Predicting...' : 'Predict Yield'}
          </button>
        </form>

        {showReport && prediction !== null && (
          <PredictionReport formData={formData} prediction={prediction} />
        )}
      </div>
    </div>
  );
};

export default Prediction;