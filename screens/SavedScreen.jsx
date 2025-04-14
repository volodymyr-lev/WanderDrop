import React,{useContext, useState, useEffect} from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getUser, getPlacesByIds } from '../firebase/firebase';
import Contribute from '../components/Contribute';
import { ScrollView } from 'react-native-gesture-handler';
import { EventRegister } from 'react-native-event-listeners';


export default function SavedScreen() {
    const {user} = useContext(AuthContext);

    const [userData, setUserData] = useState(null);
    const [savedPlaces, setSavedPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUser(user.uid);
                if (userData?.saved?.length > 0) {
                    const places = await getPlacesByIds(userData.saved);
                    setSavedPlaces(places);
                } else {
                    setSavedPlaces([]);
                }
            } catch (err) {
                console.log("Error fetching saved places:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.uid) {
            fetchData();
        }

        const eventListener = EventRegister.addEventListener('SAVED_CHANGED', async () => {
            console.log("SAVED_CHANGED event detected, fetching saved places again...");
            await fetchData(); 
        });

        return () => {
            EventRegister.removeEventListener(eventListener);
        };
    }, [user?.uid]); 

    if (loading && user) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    console.log(savedPlaces);

    return (
        <View style={styles.container}>
            { user ? (
            <View style={{flex:1}}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        Saved Places
                    </Text>
                </View>

                <ScrollView style={styles.savedContainer}>
                    {savedPlaces.map((place, index)=>(
                        <Contribute key = {index} contribute={place}/>
                    ))}
                </ScrollView>
            </View>

            ) : (
                <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
                    <Text style={styles.loginText}>
                            Please log in to access this feature.
                    </Text>
                </View>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161414'
    },
    header: {
        marginTop: 60,
        marginLeft: 20
    },
    headerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 20
    },
    savedContainer:{
        flex: 1,
        padding: 20
    },
    loginText: {
        color: '#fff',
    },
});