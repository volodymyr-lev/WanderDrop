import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContributeScreen from '../screens/ContributeScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import AddPlace from '../components/AddPlace';
import SavedScreen from '../screens/SavedScreen';

const Stack = createNativeStackNavigator();

export default function SavedStack() {
  return (
    <Stack.Navigator
    screenOptions={{
        contentStyle: { backgroundColor: '#161414' },
      }}
    >
        <Stack.Screen name="SavedScreen" component={SavedScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} options={{ title: 'Details', headerShown: false }} />
    </Stack.Navigator>
  );
}

