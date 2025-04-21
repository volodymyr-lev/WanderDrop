import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import OpenMapButton from '../components/OpenMapButton';
import { getReviewsById, getUser } from '../firebase/firebase'; 
import Review from '../components/Review';
import { AuthContext } from '../context/AuthContext';
import { handleSave } from '../firebase/firebase'; 
import { EventRegister } from 'react-native-event-listeners';
import AddReviewModal from '../components/AddReviewModal'

export default function PlaceDetailsScreen({route}) {
    const {user} = useContext(AuthContext);
    const navigation = useNavigation();
    const { marker } = route.params;
    
    const [reviews, setReviews] = useState([]);
    const [location, setLocation] = useState(null); 
    const [distance, setDistance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    
    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalVisible(true);
    };
    const closeModal = () => {
        setSelectedImage(null);
        setIsModalVisible(false);
    };
    
    let isSaved = false;



    const fetchAllData = async () => {
        setLoading(true);
        try {
            const reviewsData = await getReviewsById(marker.id);
            let u = null;
            if(user)
            {
                u = await getUser(user.uid);
            }
    
            let { status } = await Location.requestForegroundPermissionsAsync(); 
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                setLoading(false);
                return;
            }
    
            let loc = await Location.getCurrentPositionAsync({});
    

            setReviews(reviewsData);
            if(user){
                setUserData(u);
            }
            setLocation(loc.coords);
        } catch (err) {
            console.error("Error fetching all data", err);
        }
        setLoading(false);
    };
    
    useEffect(() => {
        fetchAllData();
    
        const eventListener = EventRegister.addEventListener('SAVED_CHANGED', async () => {
            console.log("Fetching all data from event");
            await fetchAllData();
        });
    
        return () => {
            EventRegister.removeEventListener(eventListener);
        };
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

    if (loading) {
        return (
            <View style={{backgroundColor:'#161414'}}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    if(userData){
        isSaved = userData.saved.includes(marker.id);
    }

    return (
        <ScrollView style={containerStyles}>
                <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color="#fff"
                    style={{ marginLeft: 16 }}
                    onPress={() => navigation.goBack()}
                />
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
                    
                        <TouchableOpacity style={{position: 'absolute', bottom: 20, right: 20}}
                            onPress={()=>{
                                if(user){
                                    handleSave(user.uid,marker.id,userData.saved)
                                }
                            }}
                        >
                            <FontAwesome5 
                                name="bookmark" 
                                color={isSaved? '#24C690' : '#fff'} 
                                size={24}
                                solid={isSaved}
                                />
                        </TouchableOpacity>
                    </View>

                </View>


                <MapView
                    style={mapStyles.map}
                    initialRegion={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    showsUserLocation={true}
                    scrollEnabled={false} 
                    zoomEnabled={false}   
                    rotateEnabled={false} 
                    pitchEnabled={false}  
                >
                    <Marker
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} 
                        image={marker.isNice ? require('../assets/marker-nice.png') : require('../assets/marker.png')}
                    />

                    <View style={mapStyles.fab}>
                    <OpenMapButton 
                        latitude={marker.latitude} 
                        longitude={marker.longitude}
                        />
                    </View>
                </MapView>

                
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
        
                    
                {/* reviews */}
                <ScrollView style = {reviewStyles.container}>
                    <Text
                        style={{color: '#fff', fontSize: 14, marginBottom: 10}}
                    >Reviews</Text>


                    {reviews.length > 0 ? (
                        <>
                            {reviews.map((review, index) => (
                                <Review
                                    key={index}
                                    data={review}
                                    pad={20}
                                    backColor={'#333333'}
                                />
                            ))}
                        </>
                    ) : (
                        <Text style={{ color: 'white', padding: 20 }}>
                            No reviews yet.
                        </Text>
                    )}

                    {user && (
                    <>
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={{
                                backgroundColor: '#24C690',
                                padding: 10,
                                borderRadius: 5,
                                marginTop: 20,
                                alignSelf: 'center',
                                marginBottom: 20,
                            }}
                        >
                            <Text style={{ color: '#fff' }}>Add Review</Text>
                        </TouchableOpacity>

                        <AddReviewModal
                            visible={modalVisible}
                            onClose={() => setModalVisible(false)}
                            placeId={marker.id}
                            user={user}
                            onReviewAdded={fetchAllData}
                        />
                    </>
                    )}
                </ScrollView>

            </View>
            
        </ScrollView>
        
    );
}

const mapStyles = StyleSheet.create({
    map: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginTop: 16,
    },
    fab: { 
        right: 10,
        top: '70%',
    }
}); 

const containerStyles = StyleSheet.create({
    backgroundColor: '#161414',
    flex: 1,
    paddingTop: 50,

})

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

const reviewStyles = StyleSheet.create({    
    container: {
        flex: 1,
        backgroundColor: '#393939',
        padding: 20,
        marginBottom: 10,
        marginTop: 16,
        borderRadius: 16,
        maxHeight: 400,
    },
})