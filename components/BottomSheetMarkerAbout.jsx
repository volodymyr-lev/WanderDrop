import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Modal, TouchableOpacity, Touchable } from 'react-native';
import * as Location from 'expo-location';
import { ScrollView } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons';
import OpenMapButton from './OpenMapButton'; 
import { useNavigation } from '@react-navigation/native';

export default function BottomSheetMarkerAbout({ marker }) {
    const navigation = useNavigation();
    const [location, setLocation] = useState(null); 
    const [distance, setDistance] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };
    const closeModal = () => {
        setSelectedImage(null);
        setModalVisible(false);
    };

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

    const calculateDistance = (userLat, userLong) => {
        if (marker.latitude && marker.longitude) {
            const R = 6371; // Radius of the Earth 
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

    useEffect(() => {
        if (location) {
            calculateDistance(location.latitude, location.longitude);
        }
    }, [location, marker]);

    return (
        <View style={headerStyles.container}>
            {/* header */}
            <View style={headerStyles.about_header}>
                <Image
                    source={{ uri: marker.image_url[0] }}  
                    style={(marker.isNice) ? headerStyles.image_nice : headerStyles.image}
                    resizeMode="cover" 
                />

                <View style={headerStyles.header_text_container}>
                    <Text style={headerStyles.header_text_header}>{marker.name}</Text>
                    <Text style={headerStyles.header_text}>Added By: {marker.added_by}</Text>
                    <Text style={headerStyles.header_text}>
                        Distance: {loading ? <ActivityIndicator size="small" color="#fff" /> : (distance ? `${distance} km` : 'Calculating...')}
                    </Text>
                

                    <TouchableOpacity style={{
                        backgroundColor: '#24C690',
                        position:'absolute',
                        bottom: 15,
                        right: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                    }}
                        onPress={()=>{navigation.navigate('PlaceDetails',{marker})}}
                    >
                        <FontAwesome5 name="angle-right" size={20} color="#fff" />

                    </TouchableOpacity>
                </View>

            </View>

            {/* description */}
            <ScrollView style={descriptionStyles.container}>
                <Text style={descriptionStyles.descriptionText}>{marker.description+'\n'}</Text>
            </ScrollView>


            {/* photos */}
            {marker.image_url && marker.image_url.length > 0 && (
                <View style={photosStyles.imageCollageContainer}>
                    <Text style={photosStyles.imageCollageTitle}>Photos</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {marker.image_url.map((imageUrl, index) => (
                            <TouchableOpacity key={index} onPress={() => openModal(imageUrl)}>
                                <Image
                                    key={index}
                                    source={{ uri: imageUrl }}
                                    style={photosStyles.image}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Modal for image preview */}
            {selectedImage && (
                <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
                >
                <View style={photosStyles.modalContainer} onTouchEnd={closeModal}>
                    <Image
                        source={{ uri: selectedImage }}
                        style={photosStyles.modalImage}
                    />
                </View>
                </Modal>
            )}
    
                
            {/* Open Map Button */}
        </View>
    );
}

const headerStyles = StyleSheet.create({
    container: {
        padding:0,
        margin: 16,
    },
    about_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 0,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,            
        borderColor: "#3EC3FF",
    },
    image_nice: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,            
        borderColor: "#24C690",
    },
    header_text_container: {
        width: '68%',
        backgroundColor: '#393939',
        padding: 18,
        borderRadius: 10,
    },
    header_text_header: {
        color: '#fff',
        marginBottom: 10,
        fontSize: 16,
    },
    header_text: {
        color: '#fff',
        fontSize: 12,
    },
});

const descriptionStyles = StyleSheet.create({
    container: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#393939',
        borderRadius: 10,
        maxHeight: 200,
    },
    descriptionText: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
    },
});

const photosStyles = StyleSheet.create({
    container: {
        padding: 16,
        margin: 16,
    },
    imageCollageContainer: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#393939',
        borderRadius: 10,
    },
    imageCollageTitle: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 10,
        
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    },
    modalImage: {
        width: '90%',
        height: '80%',
        borderRadius: 10,
    },
})