import React, { use, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function FoundPlace({marker, navigation}) {
    const [location, setLocation] = React.useState(null);
    const [distance, setDistance] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync(); 
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
        
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
            setLoading(false);
        })();
    }, []);

    if(!loading && !location){
        return;
    }

    useEffect(() => {
        if (location) {
            calculateDistance(location.latitude, location.longitude);
        }
    }, [location]);

    const calculateDistance = (userLat, userLong) => {
        if (marker.latitude && marker.longitude) {
            const R = 6371; 
            const dLat = toRadians(marker.latitude - userLat);
            const dLong = toRadians(marker.longitude - userLong);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(userLat)) *
                    Math.cos(toRadians(marker.latitude)) *
                    Math.sin(dLong / 2) *
                    Math.sin(dLong / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distanceInKm = R * c; 
            setDistance(distanceInKm.toFixed(2));
        }
    };

    const toRadians = (degree) => {
        return (degree * Math.PI) / 180;
    };

    return (
        <TouchableOpacity style = {styles.container} onPress={() => navigation.navigate('PlaceDetails', {marker})}>
            <Image
                source={{ uri: marker.image_url[0] }}            
                resizeMode="cover"
                style={styles.image}
                /> 

            <View style = {styles.textContainer}>

                <Text style={styles.textName}>
                    {marker.name}
                </Text>
                    
                <View style={{marginTop:10, flexDirection: 'row', alignItems: 'center'}}>
                    {/*img*/}
                    <MaterialIcons name="location-on" size={16} color="#24C690" />
                    <Text style={styles.distanceText}>{distance}km</Text>
                    {/*dist*/}
                </View>

            </View>
            
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        width: 380,
        height: 100,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#393939',
        padding: 10,
        borderRadius: 16,
        marginBottom: 12,
    },
    textName:{
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
        maxWidth: 140,
    },
    distanceText:{
        fontSize: 12,
        color: '#FFFFFF',
        marginLeft: 5,
        fontWeight: 'bold',
    },

    image:{
        width: 80,
        borderRadius: 8,
        height: 60,
        marginRight: 10,
        marginLeft: 10,
    },
})