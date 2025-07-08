import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
if (!API_KEY) {
  console.error('OpenWeather API key is not configured. Please check your .env file.');
}
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Configure axios defaults for timeout and retries
const axiosInstance = axios.create({
  timeout: 15000, // 15 seconds timeout
  retries: 3,
  retryDelay: 2000 // Initial delay of 2 seconds
});

// Network status check
const isOnline = () => navigator.onLine;

// Custom error class for offline state
class NetworkError extends Error {
  constructor(message = 'Network connection is unavailable') {
    super(message);
    this.name = 'NetworkError';
  }
}

// Add retry interceptor with exponential backoff
axiosInstance.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config || !config.retries) return Promise.reject(error);

  // Check network status first
  if (!isOnline()) {
    return Promise.reject(new NetworkError());
  }
  
  config.retryCount = config.retryCount ?? 0;
  if (config.retryCount >= config.retries) {
    return Promise.reject(error);
  }
  
  config.retryCount += 1;
  // Implement exponential backoff with jitter
  const backoffDelay = config.retryDelay * Math.pow(2, config.retryCount - 1);
  const jitter = Math.random() * 1000; // Add randomness to prevent thundering herd
  const delayTime = backoffDelay + jitter;
  
  await new Promise(resolve => setTimeout(resolve, delayTime));
  return axiosInstance(config);
});

// Add request interceptor to check network status before making request
axiosInstance.interceptors.request.use(async (config) => {
  if (!isOnline()) {
    return Promise.reject(new NetworkError());
  }
  return config;
});

const getWeatherByCity = async (city) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/weather`, {
      params: {
        q: `${city},IN`,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    if (error instanceof NetworkError) {
      throw new Error('Unable to fetch weather data. Please check your internet connection and try again.');
    }
    if (error.response) {
      // Server responded with error status
      throw new Error(`Weather service error: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Weather service is not responding. Please try again later.');
    } else {
      // Other errors
      throw new Error('Failed to fetch weather data. Please try again later.');
    }
  }
};

const getForecastByCity = async (city) => {
  try {
    if (!API_KEY) {
      throw new Error('Weather API key is not configured');
    }
    
    const response = await axiosInstance.get(`${BASE_URL}/forecast`, {
      params: {
        q: `${city},IN`,
        appid: API_KEY,
        units: 'metric'
      }
    });
    
    return response.data;
  } catch (error) {
    if (error instanceof NetworkError) {
      throw new Error('Unable to fetch forecast data. Please check your internet connection and try again.');
    }
    if (error.response) {
      // Server responded with error status
      throw new Error(`Forecast service error: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Forecast service is not responding. Please try again later.');
    } else {
      // Other errors
      throw new Error('Failed to fetch forecast data. Please try again later.');
    }
  }
};

export { getWeatherByCity, getForecastByCity };