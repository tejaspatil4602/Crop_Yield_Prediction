import { Card, CardContent, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { useState } from 'react';

const crops = ['RICE', 'KHARIF SORGHUM', 'PEARL MILLET', 'MAIZE', 'FINGER MILLET', 'PIGEONPEA', 'MINOR PULSES', 'GROUNDNUT', 'SESAMUM', 'SUNFLOWER', 'SOYABEAN', 'OILSEEDS', 'SUGARCANE', 'COTTON'];

const historicalData = [
  { year: 2019, yield: 3200, rainfall: 750, temperature: 26 },
  { year: 2020, yield: 3500, rainfall: 800, temperature: 25 },
  { year: 2021, yield: 3800, rainfall: 900, temperature: 24 },
  { year: 2022, yield: 3300, rainfall: 700, temperature: 27 },
  { year: 2023, yield: 3600, rainfall: 850, temperature: 25 }
];

const regionalData = {
  'RICE': [
    { region: 'North', production: 2000 },
    { region: 'South', production: 3200 },
    { region: 'East', production: 3000 },
    { region: 'West', production: 2400 }
  ],
  'KHARIF SORGHUM': [
    { region: 'North', production: 2400 },
    { region: 'South', production: 2100 },
    { region: 'East', production: 2300 },
    { region: 'West', production: 2500 }
  ],
  'PEARL MILLET': [
    { region: 'North', production: 1800 },
    { region: 'South', production: 1600 },
    { region: 'East', production: 1900 },
    { region: 'West', production: 1700 }
  ],
  'MAIZE': [
    { region: 'North', production: 2400 },
    { region: 'South', production: 2100 },
    { region: 'East', production: 2300 },
    { region: 'West', production: 2500 }
  ],
  'FINGER MILLET': [
    { region: 'North', production: 1200 },
    { region: 'South', production: 1800 },
    { region: 'East', production: 1400 },
    { region: 'West', production: 1600 }
  ],
  'PIGEONPEA': [
    { region: 'North', production: 1600 },
    { region: 'South', production: 1400 },
    { region: 'East', production: 1500 },
    { region: 'West', production: 1700 }
  ],
  'MINOR PULSES': [
    { region: 'North', production: 1100 },
    { region: 'South', production: 1300 },
    { region: 'East', production: 1200 },
    { region: 'West', production: 1400 }
  ],
  'GROUNDNUT': [
    { region: 'North', production: 1300 },
    { region: 'South', production: 1700 },
    { region: 'East', production: 1400 },
    { region: 'West', production: 1500 }
  ],
  'SESAMUM': [
    { region: 'North', production: 900 },
    { region: 'South', production: 1100 },
    { region: 'East', production: 1000 },
    { region: 'West', production: 1200 }
  ],
  'SUNFLOWER': [
    { region: 'North', production: 1000 },
    { region: 'South', production: 1200 },
    { region: 'East', production: 1100 },
    { region: 'West', production: 1300 }
  ],
  'SOYABEAN': [
    { region: 'North', production: 1600 },
    { region: 'South', production: 1400 },
    { region: 'East', production: 1500 },
    { region: 'West', production: 1700 }
  ],
  'OILSEEDS': [
    { region: 'North', production: 1400 },
    { region: 'South', production: 1600 },
    { region: 'East', production: 1500 },
    { region: 'West', production: 1700 }
  ],
  'SUGARCANE': [
    { region: 'North', production: 4500 },
    { region: 'South', production: 5000 },
    { region: 'East', production: 4200 },
    { region: 'West', production: 4800 }
  ],
  'COTTON': [
    { region: 'North', production: 1200 },
    { region: 'South', production: 1800 },
    { region: 'East', production: 1400 },
    { region: 'West', production: 1600 }
  ]
};

const soilNutrientData = {
  'RICE': [
    { nutrient: 'N', value: 0.7 },
    { nutrient: 'P', value: 0.5 },
    { nutrient: 'K', value: 0.8 }
  ],
  'KHARIF SORGHUM': [
    { nutrient: 'N', value: 0.6 },
    { nutrient: 'P', value: 0.4 },
    { nutrient: 'K', value: 0.7 }
  ],
  'PEARL MILLET': [
    { nutrient: 'N', value: 0.5 },
    { nutrient: 'P', value: 0.4 },
    { nutrient: 'K', value: 0.6 }
  ],
  'MAIZE': [
    { nutrient: 'N', value: 0.6 },
    { nutrient: 'P', value: 0.7 },
    { nutrient: 'K', value: 0.6 }
  ],
  'FINGER MILLET': [
    { nutrient: 'N', value: 0.4 },
    { nutrient: 'P', value: 0.5 },
    { nutrient: 'K', value: 0.5 }
  ],
  'PIGEONPEA': [
    { nutrient: 'N', value: 0.3 },
    { nutrient: 'P', value: 0.4 },
    { nutrient: 'K', value: 0.5 }
  ],
  'MINOR PULSES': [
    { nutrient: 'N', value: 0.3 },
    { nutrient: 'P', value: 0.4 },
    { nutrient: 'K', value: 0.5 }
  ],
  'GROUNDNUT': [
    { nutrient: 'N', value: 0.5 },
    { nutrient: 'P', value: 0.6 },
    { nutrient: 'K', value: 0.5 }
  ],
  'SESAMUM': [
    { nutrient: 'N', value: 0.4 },
    { nutrient: 'P', value: 0.5 },
    { nutrient: 'K', value: 0.4 }
  ],
  'SUNFLOWER': [
    { nutrient: 'N', value: 0.5 },
    { nutrient: 'P', value: 0.6 },
    { nutrient: 'K', value: 0.5 }
  ],
  'SOYABEAN': [
    { nutrient: 'N', value: 0.4 },
    { nutrient: 'P', value: 0.5 },
    { nutrient: 'K', value: 0.6 }
  ],
  'OILSEEDS': [
    { nutrient: 'N', value: 0.5 },
    { nutrient: 'P', value: 0.6 },
    { nutrient: 'K', value: 0.5 }
  ],
  'SUGARCANE': [
    { nutrient: 'N', value: 0.9 },
    { nutrient: 'P', value: 0.7 },
    { nutrient: 'K', value: 0.8 }
  ],
  'COTTON': [
    { nutrient: 'N', value: 0.7 },
    { nutrient: 'P', value: 0.6 },
    { nutrient: 'K', value: 0.5 }
  ]
};

const Analytics = () => {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Crop Yield Analytics
        </Typography>
        <FormControl sx={{ minWidth: 200, mb: 3 }}>
          <InputLabel>Select Crop</InputLabel>
          <Select
            value={selectedCrop}
            label="Select Crop"
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            {crops.map((crop) => (
              <MenuItem key={crop} value={crop}>{crop}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Historical Yield Data
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 4000]} />
                <Tooltip formatter={(value) => [`${value}`, 'Yield']} />
                <Legend />
                <Line type="monotone" dataKey="yield" stroke="#8884d8" name="Crop Yield" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Weather Impact Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rainfall" name="Rainfall (mm)" />
                <YAxis dataKey="yield" name="Yield" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name="Rainfall vs Yield" data={historicalData} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Regional Production
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalData[selectedCrop] || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="production" fill="#82ca9d" name="Production" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Soil Nutrients Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={soilNutrientData[selectedCrop] || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nutrient" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Nutrient Level">
                  {(soilNutrientData[selectedCrop] || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Analytics;