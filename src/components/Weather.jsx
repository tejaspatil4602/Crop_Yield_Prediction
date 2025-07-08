import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Grid,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import {
  getWeatherByCity,
  getForecastByCity,
} from "../services/weatherService";
import {
  WbSunny,
  Cloud,
  Grain,
  Thunderstorm,
  AcUnit,
  Air,
  Opacity,
  WbTwilight,
  Thermostat,
  Speed,
  Visibility,
} from "@mui/icons-material"; // Example icons

const cities = [
  "Mumbai",
  "Pune",
  "Nagpur",
  "Nashik",
  "Aurangabad",
  "Solapur",
  "Amravati",
  "Kolhapur",
  "Thane",
  "Navi Mumbai",
  "Akola",
  "Jalgaon",
  "Ahmednagar",
  "Chandrapur",
  "Parbhani",
  "Dhule",
  "Nanded",
  "Satara",
  "Sangli",
  "Latur",
  "Yavatmal",
  "Wardha",
  "Osmanabad",
  "Beed",
  "Buldhana",
  "Ratnagiri",
  "Jalna",
];

// Helper function to get a weather icon (replace with actual logic)
const getWeatherIcon = (description) => {
  const desc = description?.toLowerCase() || "";
  if (desc.includes("clear") || desc.includes("sunny"))
    return (
      <WbSunny
        sx={{
          fontSize: "4rem",
          color: "#81C784",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
        }}
      />
    );
  if (desc.includes("cloud"))
    return (
      <Cloud
        sx={{
          fontSize: "4rem",
          color: "#4FC3F7",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
        }}
      />
    );
  if (desc.includes("rain") || desc.includes("drizzle"))
    return (
      <Grain
        sx={{
          fontSize: "4rem",
          color: "#4FC3F7",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
        }}
      />
    );
  if (desc.includes("storm"))
    return (
      <Thunderstorm
        sx={{
          fontSize: "4rem",
          color: "#4FC3F7",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
        }}
      />
    );
  if (desc.includes("snow"))
    return (
      <AcUnit
        sx={{
          fontSize: "4rem",
          color: "#4FC3F7",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
        }}
      />
    );
  return (
    <WbSunny
      sx={{
        fontSize: "4rem",
        color: "#81C784",
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
      }}
    />
  ); // Default icon
};

const Weather = () => {
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added comment to test file update

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const weatherData = await getWeatherByCity(selectedCity);
        const forecastData = await getForecastByCity(selectedCity);
        setWeather(weatherData);
        setForecast(forecastData);
      } catch (error) {
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };
    if (selectedCity) {
      fetchWeather();
    }
  }, [selectedCity]);

  const handleCityChange = (event, newValue) => {
    if (newValue) {
      setSelectedCity(newValue);
    }
  };

  const getDayOfWeek = (dt) => {
    const date = new Date(dt * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const hourlyForecastData = forecast?.list
    ?.slice(0, 6)
    .map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      temp: Math.round(item.main.temp),
      icon: getWeatherIcon(item.weather[0].description),
    })) || [];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#E6F4EA", // Fresh Mint Green
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 4,
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#333", marginBottom: 4 }}
      >
        Weather Dashboard
      </Typography>

      <Autocomplete
        options={cities}
        value={selectedCity}
        onChange={handleCityChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select City"
            variant="outlined"
            sx={{
              minWidth: 300,
              marginBottom: 4,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#B7D9A7",
                },
                "&:hover fieldset": {
                  borderColor: "#A17C6B",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#A17C6B",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#A17C6B",
              },
              "& .MuiInputBase-input": {
                color: "#333",
              },
            }}
          />
        )}
      />

      {loading && <CircularProgress sx={{ color: "#B7D9A7" }} />}

      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}

      {weather && !loading && (
        <Grid container spacing={4} justifyContent="center">
          {/* Current Weather Card */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                minWidth: 275,
                backgroundColor: "#B7D9A7", // Plant Green
                borderRadius: "15px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": { boxShadow: "0 12px 25px rgba(0,0,0,0.2)" },
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ color: "#333" }}
                    >
                      {weather.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5, color: "#555" }}>
                      {weather.weather[0].description}
                    </Typography>
                    <Typography variant="h3" sx={{ color: "#333" }}>
                      {Math.round(weather.main.temp)}°C
                    </Typography>
                  </Box>
                  {getWeatherIcon(weather.weather[0].description)}
                </Stack>
                <Divider sx={{ my: 2, borderColor: "#A17C6B" }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Thermostat sx={{ color: "#A17C6B" }} />
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        Feels like: {Math.round(weather.main.feels_like)}°C
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Opacity sx={{ color: "#A17C6B" }} />
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        Humidity: {weather.main.humidity}%
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Air sx={{ color: "#A17C6B" }} />
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        Wind: {weather.wind.speed} m/s
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Speed sx={{ color: "#A17C6B" }} />
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        Pressure: {weather.main.pressure} hPa
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Visibility sx={{ color: "#A17C6B" }} />
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        Visibility: {weather.visibility / 1000} km
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Hourly Forecast Card */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                minWidth: 275,
                backgroundColor: "#B7D9A7", // Plant Green
                borderRadius: "15px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": { boxShadow: "0 12px 25px rgba(0,0,0,0.2)" },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  sx={{ color: "#333" }}
                >
                  Hourly Forecast
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  divider={<Divider orientation="vertical" flexItem />}
                  sx={{ overflowX: "auto", pb: 1 }}
                >
                  {hourlyForecastData.map((hour, index) => (
                    <Box
                      key={index}
                      sx={{
                        textAlign: "center",
                        minWidth: "80px",
                        padding: "8px",
                        backgroundColor: "#E6F4EA", // Fresh Mint Green for hourly forecast items
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#555" }}>
                        {hour.time}
                      </Typography>
                      <Box sx={{ my: 1 }}>{hour.icon}</Box>
                      <Typography variant="body1" sx={{ color: "#333" }}>
                        {hour.temp}°C
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Daily Forecast Card */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                minWidth: 275,
                backgroundColor: "#B7D9A7", // Plant Green
                borderRadius: "15px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": { boxShadow: "0 12px 25px rgba(0,0,0,0.2)" },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  sx={{ color: "#333" }}
                >
                  Daily Forecast
                </Typography>
                <Grid container spacing={2}>
                  {forecast?.list
                    ?.filter((item) => item.dt_txt.includes("12:00:00"))
                    .slice(0, 5)
                    .map((day, index) => (
                      <Grid item xs={12} sm={4} md={2.4} key={index}>
                        <Paper
                          sx={{
                            padding: 2,
                            textAlign: "center",
                            backgroundColor: "#E6F4EA", // Fresh Mint Green for daily forecast items
                            borderRadius: "10px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ color: "#333" }}>
                            {getDayOfWeek(day.dt)}
                          </Typography>
                          <Box sx={{ my: 1 }}>
                            {getWeatherIcon(day.weather[0].description)}
                          </Box>
                          <Typography variant="body2" sx={{ color: "#555" }}>
                            {Math.round(day.main.temp_min)}°C / {Math.round(day.main.temp_max)}°C
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Weather;
