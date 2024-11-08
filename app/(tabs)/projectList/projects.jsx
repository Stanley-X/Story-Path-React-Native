import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as apiService from '/Users/xuanliangchen/Desktop/2024S2/COMP2140/Assignment3/StoryPath/apiService.js'; 
import { router } from 'expo-router';

const ProjectsList = () => {
  const [projectsList, setProjectsList] = useState([]);
  const navigation = useNavigation(); 

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiService.getProjects();
        const publishedProjects = data.filter(project => project.is_published === true);
        setProjectsList(publishedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const renderProject = ({ item }) => (
    <View style={styles.card} key={item.id}>
      <View style={styles.cardBody}>
        <View>
          <Text style={styles.title}>
            {item.title}{' '}
          </Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push(`/(tabs)/projectList/previewPage?id=${item.id}`);
            }}
          >
            <Text style={styles.buttonText}>Preview</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Projects</Text>

      {projectsList.length === 0 ? (
        <Text style={styles.noProjects}>No published projects available.</Text>
      ) : (
        <FlatList
          data={projectsList}
          renderItem={renderProject}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default ProjectsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  noProjects: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});