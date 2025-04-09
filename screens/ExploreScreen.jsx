import 'react-native-reanimated';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getMarkers } from '../firebase/firebase';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import BottomSheetMarkerInfo from '../components/BottomSheetMarkerInfo';
import OpenMapButton from '../components/OpenMapButton';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export default function ExploreScreen() {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const showFab = useSharedValue(false);
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['50%', '85%'], []);
    
    const handleMarkerPress = (marker) => {
        setSelectedMarker(marker);
        setTimeout(() => {
            bottomSheetRef.current?.snapToIndex(1);
        }, 100);
    };

    const handleSheetChanges = (index) => {
        showFab.value = index >= 0;
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync(); 
            if (status !== 'granted') {
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

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(showFab.value ? 1 : 0, { duration: 300 }),
            transform: [
                {
                    translateY: withTiming(showFab.value ? 0 : 30, { duration: 300 }),
                },
            ],
        };
    });

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
                    {markers.map((marker) => (
                        <Marker
                            key={marker.id}
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            onPress={() => handleMarkerPress(marker)}
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
                onChange={handleSheetChanges}
            >
                <BottomSheetView style={styles.bottomSheetView}>
                    <BottomSheetMarkerInfo marker={selectedMarker} />
                </BottomSheetView>
            </BottomSheet>

            {selectedMarker && (
                <Animated.View style={[{
                    position: 'absolute',
                    right: 10,
                    bottom: 90,
                    zIndex: 1000,
                }, animatedStyle]}>
                    <OpenMapButton 
                        latitude={selectedMarker?.latitude} 
                        longitude={selectedMarker?.longitude} 
                    />
                </Animated.View>
            )}
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
