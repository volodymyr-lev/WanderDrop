import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ExploreScreen from '../screens/ExploreScreen';
import GoScreen from '../screens/GoScreen';
import SavedScreen from '../screens/SavedScreen';
import ContributeScreen from '../screens/ContributeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { View } from 'react-native';
import GoStack from './GoStack';
import ProfileStack from './ProfileStack';


const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <NavigationContainer zIndex>
           <Tab.Navigator
            screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#161414',
                height: 110,
                borderTopWidth: 0,
                paddingTop:12
            },
            tabBarIcon: ({ focused, color, size }) => {
                let IconComponent;
                let iconName;

                switch (route.name) {
                    case 'Explore':
                        IconComponent = Ionicons;
                        iconName = 'location-sharp';
                        break;
                    case 'Go':
                        IconComponent = MaterialIcons;
                        iconName = 'directions-car';
                        break;
                    case 'Saved':
                        IconComponent = Ionicons;
                        iconName = 'bookmark-outline';
                        break;
                    case 'Contribute':
                        IconComponent = FontAwesome;
                        iconName = 'plus-circle';
                        break;
                    case 'Profile':
                        IconComponent = Ionicons;
                        iconName = 'person-outline';
                        break;
                    default:
                        return null;
                  }

                return (
                    <View style={{
                        flex:1,
                        width:"200%",
                        borderRadius: 16,
                        alignItems:'center',
                        justifyContent:'center',
                    }} backgroundColor={focused ? '#24C690' : null}>
                        <IconComponent name={iconName} size={24} color={'#fff'}></IconComponent>
                    </View>
                )
            },
            
            tabBarLabelStyle: {
                fontSize: 12,
                marginTop: 4,
            },
            tabBarActiveTintColor: '#fff', 
            tabBarInactiveTintColor: '#fff',
            
        })}
      >
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Go" component={GoStack} />
        <Tab.Screen name="Saved" component={SavedScreen} />
        <Tab.Screen name="Contribute" component={ContributeScreen} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
