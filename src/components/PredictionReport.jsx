import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { useState } from 'react';

// Create styles
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

const PredictionReport = ({ formData, prediction }) => {
  if (!formData || prediction === null) return null;

  const predictionData = {
    ...formData,
    predicted_yield: prediction
  };

  // Order of parameters to display
  const parameterOrder = [
    'district_name',
    'crop_year',
    'season',
    'crop_type',
    'area',
    'temperature',
    'wind_speed',
    'precipitation',
    'humidity',
    'soil_type',
    'nitrogen',
    'phosphorus',
    'potassium',
    'pressure'
  ];

  const PredictionDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Crop Yield Prediction Report</Text>
          
          <Text style={styles.subtitle}>Input Parameters</Text>
          <View style={styles.table}>
            {parameterOrder.map((key, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableColHeader}>
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Text>
                <Text style={styles.tableCol}>{predictionData[key]}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.subtitle}>Prediction Results</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Predicted Yield</Text>
              <Text style={styles.tableCol}>{prediction.toFixed(2)} kg/ha</Text>
            </View>
          </View>

          <Text style={styles.text}>
            Note: This prediction is based on the provided parameters and historical data analysis.
            Actual yield may vary depending on various environmental factors and farming practices.
          </Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <PDFViewer style={{ width: '100%', height: '500px' }}>
      <PredictionDocument />
    </PDFViewer>
  );
};

export default PredictionReport;