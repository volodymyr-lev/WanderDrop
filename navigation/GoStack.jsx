import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GoScreen from '../screens/GoScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';

const Stack = createNativeStackNavigator();

export default function GoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GoMain" component={GoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} options={{ title: 'Details', headerShown: false }} />
    </Stack.Navigator>
  );
}