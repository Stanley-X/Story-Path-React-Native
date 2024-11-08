import React, { useState, useEffect } from 'react';
import {Alert, Button,View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as apiService from '/Users/xuanliangchen/Desktop/2024S2/COMP2140/Assignment3/StoryPath/apiService.js'; 
import { useRef } from 'react';
import { deleteAllTrackings } from '/Users/xuanliangchen/Desktop/2024S2/COMP2140/Assignment3/StoryPath/apiService.js';

import { UsernameContext } from '../../../components/usernameContext';
import { useContext } from 'react';

const Preview = () => {
  const route = useRoute();
  const { id: projectId } = route.params;
  const [project, setProject] = useState(null);
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('Home');
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [score, setScore] = useState(0);
  const handleDeleteAllTrackings = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete all tracking data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllTrackings();
              console.log('All tracking data has been deleted.');

              // Reset local state
              setVisitedLocations([]);
              setScore(0);

              Alert.alert('Success', 'All tracking data has been deleted.');
            } catch (error) {
              console.error('Error deleting all tracking data:', error);
              Alert.alert('Error', 'Unable to delete tracking data.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  const calculatedTotalPointsRef = useRef(0);

  const { username } = useContext(UsernameContext);
  console.log('Participant username from context:', username); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await apiService.getProjectById(projectId);
        setProject(projectData);

        const locationsData = await apiService.getLocationsByProjectId(projectId);
        console.log('Locations data:', locationsData); 
        setLocations(locationsData);

        const calculatedTotalPoints = locationsData.reduce((acc, loc) => {
          return acc + (loc.score_points ? parseInt(loc.score_points, 10) : 0);
        }, 0);
        calculatedTotalPointsRef.current = calculatedTotalPoints;
        console.log('Calculated total points:', calculatedTotalPointsRef.current);
        await updateAccumulatedScore();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [projectId, username]);


  const updateAccumulatedScore = async () => {
    try {
      const participantUsername = username;
      const trackingData = await apiService.getTrackingsByProjectAndParticipant(
        projectId,
        participantUsername
      );
      const visitedLocIds = trackingData.map((tracking) => tracking.location_id);
      setVisitedLocations(visitedLocIds);

      const totalAccumulatedPoints = trackingData.reduce(
        (acc, tracking) => acc + (tracking.points ? parseInt(tracking.points, 10) : 0),
        0
      );
      setScore(totalAccumulatedPoints);
      console.log('Updated total accumulated points:', totalAccumulatedPoints);


      if (totalAccumulatedPoints >= calculatedTotalPointsRef.current) {
        Alert.alert('Exploration Complete!', 'You have accumulated all the points.');
      }
    } catch (error) {
      console.error('Error updating accumulated score:', error);
    }
  };

  const handleLocationChange = async (itemValue) => {
    if (itemValue === 'Home') {
      setCurrentLocation('Home');
    } else {
      const selectedLocation = locations.find((loc) => loc.id === parseInt(itemValue));
      setCurrentLocation(selectedLocation);

      if (!visitedLocations.includes(selectedLocation.id)) {

        let pointsToAdd = 0;
        try {
          const locationScorePointsStr = await apiService.getLocationScorePoints(selectedLocation.id);
          const locationScorePoints = parseInt(locationScorePointsStr, 10) || 0;
          console.log('Fetched score_points for location:', locationScorePoints); 
          pointsToAdd = locationScorePoints;

          console.log(`Points to Add for this location: ${pointsToAdd}`);
        } catch (error) {
          console.error('Error fetching score_points for location:', error);
        }

        
        try {
          const participantUsername = username;
          console.log('Creating tracking record for participant:', participantUsername);

          const tracking = {
            project_id: projectId,
            location_id: selectedLocation.id,
            points: pointsToAdd,
            participant_username: participantUsername,
          };
          console.log('Tracking object to be sent:', tracking);

          const trackingResponse = await apiService.createTracking(tracking);

          console.log('Tracking record created:', trackingResponse);

          
          await updateAccumulatedScore();
        } catch (error) {
          console.error('Error creating tracking record:', error);
        }
      } else {
        console.log(`Location ID ${selectedLocation.id} has already been visited.`);
      }
    }
  };

  if (!project || locations.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{project.title} - Preview</Text>

      <ScrollView contentContainerStyle={styles.previewContainer}>
        <View style={styles.pickerContainer}>
          <Text>Change Locations to Test Scoring:</Text>
          <Picker
            selectedValue={currentLocation === 'Home' ? 'Home' : currentLocation.id}
            style={styles.picker}
            onValueChange={(itemValue) => handleLocationChange(itemValue)}
          >
            <Picker.Item label="Homescreen" value="Home" />
            {locations.map((loc) => (
              <Picker.Item key={loc.id} label={loc.location_name} value={loc.id} />
            ))}
          </Picker>
          
        </View>

        {currentLocation === 'Home' ? (
          <View style={styles.homeScreen}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.boldText}>Instructions</Text>
            <Text>{project.instructions}</Text>
            <Text style={styles.boldText}>Initial Clue</Text>
            <Text>{project.initial_clue}</Text>
          </View>
        ) : (
          <View style={styles.locationScreen}>
            <Text style={styles.locationName}>{currentLocation.location_name}</Text>
            <Text>{currentLocation.location_content}</Text>
            {currentLocation.clue && <Text>Clue: {currentLocation.clue}</Text>}
          </View>
        )}

        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <Text style={styles.statusText}>Points</Text>
            <Text style={styles.statusValue}>
              {score}/{calculatedTotalPointsRef.current}
            </Text>
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusText}>Locations Visited</Text>
            <Text style={styles.statusValue}>
              {visitedLocations.length}/{locations.length}
            </Text>
          </View>
        </View>

        {score >= calculatedTotalPointsRef.current && (
          <Text style={styles.completionMessage}>Exploration Complete!</Text>
        )}
      </ScrollView>
      <Button title="Delete All Tracking Data" onPress={handleDeleteAllTrackings} />
    </View>
  );
};

export default Preview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  homeScreen: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    textAlign: 'center',
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#F76C6A',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  locationScreen: {
    padding: 20,
    backgroundColor: '#F76C6A',
    borderRadius: 10,
    textAlign: 'center',
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F76C6A',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
  statusItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    textAlign: 'center',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#6A0DAD',
    textAlign: 'center',
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
});