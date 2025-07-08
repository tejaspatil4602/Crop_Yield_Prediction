import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box
} from '@mui/material';
import { Download, Delete } from '@mui/icons-material';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40
  },
  section: {
    margin: 20,
    padding: 20,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 25,
    color: '#1B5E20',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 15,
    color: '#2E7D32',
    borderBottom: 1,
    borderBottomColor: '#4CAF50',
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  table: {
    display: 'table',
    width: '100%',
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 4,
    backgroundColor: '#FAFAFA'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 40,
    backgroundColor: '#FFFFFF'
  },
  tableColHeader: {
    width: '50%',
    fontWeight: 'bold',
    padding: 10,
    color: '#1B5E20',
    fontSize: 12,
    backgroundColor: '#F1F8E9'
  },
  tableCol: {
    width: '50%',
    padding: 10,
    fontSize: 12,
    color: '#424242'
  },
  text: {
    fontSize: 11,
    marginVertical: 12,
    color: '#666666',
    lineHeight: 1.6,
    textAlign: 'justify'
  }
});

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const authToken = localStorage.getItem('authToken');

      if (!userEmail || !authToken) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`http://localhost:5002/api/predictions/user/${userEmail}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }

      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (predictionId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`http://localhost:5002/api/predictions/delete/${predictionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete prediction');
      }

      // Refresh predictions after deletion
      fetchPredictions();
    } catch (err) {
      console.error('Error deleting prediction:', err);
      setError(err.message);
    }
  };

  const generatePDF = async (prediction) => {
    const userEmail = localStorage.getItem('userEmail');
    const formattedDate = new Date(prediction.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const PredictionDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Crop Yield Prediction Report</Text>

            <Text style={styles.subtitle}>User Information</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Email</Text>
                <Text style={styles.tableCol}>{userEmail}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Report Generated</Text>
                <Text style={styles.tableCol}>{formattedDate}</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>Prediction Details</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Crop Type</Text>
                <Text style={styles.tableCol}>{prediction.cropType}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Area</Text>
                <Text style={styles.tableCol}>{prediction.area} ha</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Soil Type</Text>
                <Text style={styles.tableCol}>{prediction.soilType}</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>Environmental Conditions</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Temperature</Text>
                <Text style={styles.tableCol}>{prediction.temperature}°C</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Humidity</Text>
                <Text style={styles.tableCol}>{prediction.humidity}%</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Rainfall</Text>
                <Text style={styles.tableCol}>{prediction.rainfall} mm</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>Soil Nutrients</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Nitrogen (N)</Text>
                <Text style={styles.tableCol}>{prediction.nitrogen}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Phosphorus (P)</Text>
                <Text style={styles.tableCol}>{prediction.phosphorus}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Potassium (K)</Text>
                <Text style={styles.tableCol}>{prediction.potassium}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>pH</Text>
                <Text style={styles.tableCol}>{prediction.ph}</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>Prediction Result</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Predicted Yield</Text>
                <Text style={styles.tableCol}>{prediction.predictedYield.toFixed(2)} kg/ha</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    );

    const blob = await pdf(<PredictionDocument />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prediction-report-${new Date(prediction.createdAt).toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <Typography>Loading predictions...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h6" gutterBottom>Prediction History</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Crop Type</TableCell>
              <TableCell>Area (ha)</TableCell>
              <TableCell>Soil Type</TableCell>
              <TableCell>Predicted Yield (kg/ha)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {predictions.map((prediction) => (
              <TableRow key={prediction._id}>
                <TableCell>{new Date(prediction.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{prediction.cropType}</TableCell>
                <TableCell>{prediction.area}</TableCell>
                <TableCell>{prediction.soilType}</TableCell>
                <TableCell>{prediction.predictedYield.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    startIcon={<Download />}
                    onClick={() => generatePDF(prediction)}
                    size="small"
                  >
                    PDF
                  </Button>
                  <Button
                    startIcon={<Delete />}
                    onClick={() => handleDelete(prediction._id)}
                    size="small"
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PredictionHistory;