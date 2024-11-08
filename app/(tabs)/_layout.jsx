import { View, Text, Button } from 'react-native'
import React from 'react'
import { Tabs, router } from 'expo-router'
import { Feather } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function _layout() {
  return (
   <Tabs screenOptions={{headerLeft: () => <DrawerToggleButton tintColor='#000' />}}>
    <Tabs.Screen name='projectList' options={{
      tabBarIcon: ({color}) => (
        <Feather name="list" size={24} color={color} />
      ),
      tabBarLabel: 'Projects',
      headerTitle: 'Projects'
    }} />
    <Tabs.Screen name='map' options={{
      tabBarIcon: ({color}) => (
        <Feather name="map" size={24} color={color} />
      ),
      tabBarLabel: 'Map',
      headerTitle: 'Map'
    }} />
     <Tabs.Screen name='QR' options={{
      tabBarIcon: ({color}) => (
        <Feather name="camera" size={24} color={color} />
      ),
      tabBarLabel: 'QR Scanner',
      headerTitle: 'QR Scanner'
    }} />
   </Tabs>
  )
}