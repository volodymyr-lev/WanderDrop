import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContributeScreen from '../screens/ContributeScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import AddPlace from '../components/AddPlace';

const Stack = createNativeStackNavigator();

export default function ContributeStack() {
  return (
    <Stack.Navigator
    screenOptions={{
        contentStyle: { backgroundColor: '#161414' },
      }}
    >
        <Stack.Screen name="ContributeMain" component={ContributeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddPlace" component={AddPlace} options={{ title: 'Add', headerShown: false }} />
        <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} options={{ title: 'Details', headerShown: false }} />
    </Stack.Navigator>
  );
}

