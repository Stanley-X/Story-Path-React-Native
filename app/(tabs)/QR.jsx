// Import necessary modules from React, React Native, and Expo
import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { UsernameContext } from '../../components/usernameContext';
import * as apiService from '/Users/xuanliangchen/Desktop/2024S2/COMP2140/Assignment3/StoryPath/apiService.js'; 

export default function App() {
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const { username } = useContext(UsernameContext);

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    console.log("Scanned data:", data);

    const [projIdStr, locIdStr] = data.split(',');
    const projectId = parseInt(projIdStr, 10);
    const locationId = parseInt(locIdStr, 10);

    console.log('Project ID:', projectId);
    console.log('Location ID:', locationId);

    // Retrieve the score points for the location
    let pointsToAdd = 0;
    try {
      const locationData = await apiService.getLocationById(locationId);
      const locationScorePoints = parseInt(locationData.score_points, 10) || 0;

      pointsToAdd = locationScorePoints;
      console.log(`Points to Add for this location: ${pointsToAdd}`);

      // Create a tracking record
      const tracking = {
        project_id: projectId,
        location_id: locationId,
        points: pointsToAdd,
        participant_username: username,
      };

      const trackingResponse = await apiService.createTracking(tracking);
      console.log('Tracking record created:', trackingResponse);

      Alert.alert('Success', 'Tracking data successfully uploaded.');

    } catch (error) {
      console.error('Error creating tracking record:', error);
      Alert.alert('Error', 'Unable to upload tracking data.');
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        type='front'
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
      </CameraView>
      {scanned && (
        <View style={styles.scanResultContainer}>
          <Text style={styles.scanResultText}>Scanned data: {scannedData}</Text>     
          <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  scanResultContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
  },
  scanResultText: {
    fontSize: 16,
    marginBottom: 10,
  },
});