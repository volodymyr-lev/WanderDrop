import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UserProfile from '../components/UserProfile';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Profile', headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} options={{ title: 'Details', headerShown: false }} />
    </Stack.Navigator>
  );
}