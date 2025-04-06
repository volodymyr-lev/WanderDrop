import React, { useState } from 'react'
import { View, Text, StyleSheet,Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { requestForegroundPermissionsAsync } from 'expo';
import { useEffect } from 'react';
import * as Location from 'expo-location';

import darkMapStyle from '../mapStyles/darkMapStyle.json';


export default function ExploreScreen() {

    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(()=>{
        (async ()=>{
            let {status} = await Location.getForegroundPermissionsAsync();
            r
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                setLoading(false);
                return;
            }
            
                let loc = await Location.getCurrentPositionAsync({});
                setLocation(loc.coords);
                setLoading(false);
        })();
    },[]);

    if(loading){
        return(
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map}
            initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            customMapStyle={darkMapStyle}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#161414'
    },
    text:{
        color:'#fff'
    },
    map:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#161414',
    },
});