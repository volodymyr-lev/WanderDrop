import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { db } from '../firebase/firebase';
import { collection, addDoc, doc, Timestamp, setDoc, getDoc, updateDoc} from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import MapView, { Marker } from "react-native-maps";
import { EventRegister } from 'react-native-event-listeners';

export default function AddPlace({ navigation }) {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrls, setImageUrls] = useState([""]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

    const handleAddPlace = async () => {
        if (!user) {
            Alert.alert("Please log in to add a place.");
            return;
        }

        if (!selectedLocation) {
            Alert.alert("Please pick a location on the map.");
            return;
        }

        try {

            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            
            if (userSnap.exists()) { 
                const placeDocRef = await addDoc(collection(db, "places"), {
                    name,
                    description,
                    image_url: imageUrls.filter(url => url.trim() !== ""),
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    added_by: userSnap.data().name,
                    created_at: Timestamp.now(),
                    isNice: false,
                    average_rating: 0,
                    number_of_reviews: 0,
                });

                const firstReviewRef = doc(db, 'places', placeDocRef.id, 'reviews', 'placeholder');

                const userData = userSnap.data();
                const existingContributes = userData.contributes || [];
    
                const updatedContributes = [...new Set([...existingContributes, placeDocRef.id])]; // унікальні
    
                await updateDoc(userRef, {
                    contributes: updatedContributes,
                });
    
                console.log("Place added and contributes updated");
                EventRegister.emit("MARKERS_UPDATED");
                
            }

            navigation.goBack();
        } catch (error) {
            console.error("Error adding place: ", error);
            Alert.alert("Error", "Something went wrong while adding the place.");
        }
    };

    const updateImageUrl = (text, index) => {
        const updatedUrls = [...imageUrls];
        updatedUrls[index] = text;
        setImageUrls(updatedUrls);
    };

    const addImageField = () => {
        setImageUrls([...imageUrls, ""]);
    };

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Add a New Place</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#aaa"
            />
            <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Description"
                multiline
                value={description}
                onChangeText={setDescription}
                placeholderTextColor="#aaa"
            />

            {imageUrls.map((url, index) => (
                <TextInput
                    key={index}
                    style={styles.input}
                    placeholder={`Image URL ${index + 1}`}
                    value={url}
                    onChangeText={(text) => updateImageUrl(text, index)}
                    placeholderTextColor="#aaa"
                />
            ))}

            <TouchableOpacity onPress={addImageField}>
                <Text style={styles.addImageText}>+ Add another image</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Tap on the map to pick a location:</Text>

            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 49.8397,
                        longitude: 24.0297,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    onPress={handleMapPress}
                >
                    {selectedLocation && (
                        <Marker coordinate={selectedLocation} />
                    )}
                </MapView>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAddPlace}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#161414",
    },
    title: {
        marginTop: 30,
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#24C690",
    },
    input: {
        backgroundColor: "#393939",
        color: "#fff",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    addImageText: {
        color: "#24C690",
        marginBottom: 10,
    },
    label: {
        color: "#aaa",
        marginTop: 10,
        marginBottom: 5,
    },
    mapContainer: {
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },
    map: {
        flex: 1,
    },
    button: {
        backgroundColor: "#24C690",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
