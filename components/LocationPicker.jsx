import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function LocationPicker({ navigation, route }) {
    const [pickedLocation, setPickedLocation] = useState(null);

    const handleSelectLocation = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setPickedLocation({ latitude, longitude });
    };

    const confirmLocation = () => {
        if (pickedLocation) {
            navigation.navigate('AddPlace', {
                latitude: pickedLocation.latitude,
                longitude: pickedLocation.longitude
            });
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                onPress={handleSelectLocation}
                initialRegion={{
                    latitude: 49.8397, 
                    longitude: 24.0297,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {pickedLocation && (
                    <Marker coordinate={pickedLocation} />
                )}
            </MapView>

            <TouchableOpacity style={styles.button} onPress={confirmLocation}>
                <Text style={styles.buttonText}>Confirm Location</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    button: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        backgroundColor: '#24C690',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});
