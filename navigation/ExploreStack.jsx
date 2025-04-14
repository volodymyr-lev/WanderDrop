import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContributeScreen from '../screens/ContributeScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import AddPlace from '../components/AddPlace';
import ExploreScreen from '../screens/ExploreScreen';

const Stack = createNativeStackNavigator();

export default function ExploreStack() {
  return (
    <Stack.Navigator
    screenOptions={{
        contentStyle: { backgroundColor: '#161414' },
      }}
    >
        <Stack.Screen name="ExploreMain" component={ExploreScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} options={{ title: 'Details', headerShown: false }} />
    </Stack.Navigator>
  );
}

