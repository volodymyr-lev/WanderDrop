import 'react-native-reanimated';
import React, { useState, useEffect,useRef, useMemo } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text, Button } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { getMarkers } from '../firebase/firebase';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import BottomSheetMarkerInfo from '../components/BottomSheetMarkerInfo';

export default function ExploreScreen() {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['50%', '80%'], []);
    
    const handleMarkerPress = (marker) => {
        setSelectedMarker(marker);
        
        setTimeout(() => {
            console.log(bottomSheetRef.current);
            bottomSheetRef.current?.snapToIndex(0);
        }, 100);
        console.log("Marker pressed!", marker);
    };

    useEffect(() => {
        (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync(); 
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            setLoading(false);
            return;
        }
        const fetchedMarkers = await getMarkers();
        setMarkers(fetchedMarkers);
        
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        setLoading(false);
        })();
    }, []);

    if (loading || !location) {
        return (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
        </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>      
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                    }}
                    showsUserLocation={true}>
                    
                    {markers.map((marker)=>(
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        
                        onPress={()=>handleMarkerPress(marker)}

                        image={marker.isNice ? require('../assets/marker-nice.png') : require('../assets/marker.png')}
                    />
                    ))}
                </MapView>
            </View>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1} 
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backgroundStyle={{ backgroundColor: '#161414' }}
                handleIndicatorStyle={{ backgroundColor: '#FFFFFF' }}
            >
                <BottomSheetView style={styles.bottomSheetView}>
                    <BottomSheetMarkerInfo marker={selectedMarker}/>
                </BottomSheetView>
            </BottomSheet>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161414',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#161414',
    },
    bottomSheetView: {
        height: '100%',
    },
});


