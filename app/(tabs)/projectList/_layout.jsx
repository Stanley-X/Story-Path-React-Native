// /projects/_layout.jsx
import React from 'react';
import { Stack } from 'expo-router';

export default function ProjectsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen 
        name="previewPage" 
        options={{
          title: 'Preview',
        }}
      />
      <Stack.Screen 
        name="projects" 
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}