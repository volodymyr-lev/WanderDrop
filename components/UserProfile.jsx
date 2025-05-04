import React, {useContext, useState, useEffect, useCallback} from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import ProfileTabs from '../navigation/ProfileTabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';

export default function UserProfile({navigation: propNavigation}) {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use provided navigation or get from hook
    const navigation = propNavigation || useNavigation();

    // Move fetchUserData to useCallback to avoid recreating it on each render
    const fetchUserData = useCallback(async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                console.warn("No user data found");
                setError("User profile not found");
            }
        } catch (e) {
            console.error("Error fetching user data: ", e);
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        // Initial data fetch
        fetchUserData();

        // Set up event listener
        const eventListener = EventRegister.addEventListener('MARKERS_UPDATED', () => {
            console.log("Fetching user from event");
            fetchUserData();
        });

        // Clean up
        return () => {
            if (eventListener) {
                EventRegister.removeEventListener(eventListener);
            }
        };
    }, [fetchUserData]);

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]} testID="loading-container">
                <ActivityIndicator size="large" color="#24C690" testID="activity-indicator" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container} testID="user-profile-container">
            {/* header */}
            <View style={[styles.header, {justifyContent: 'center', alignItems: 'center', marginBottom: 10}]}>
                <Text style={styles.headerText}>{userData.name}</Text>

                <TouchableOpacity 
                    style={styles.settings} 
                    onPress={() => navigation.navigate('Settings')}
                    testID='touchable'
                >
                    <FontAwesome5 name="cog" size={24} color={'#fff'}/>
                </TouchableOpacity>
            </View>

            {/* userInfo */}
            <View style={styles.userInfoContainer}>
                <Image 
                    style={styles.userInfoImage}
                    source={{uri: userData.pfp_url}}
                    testID="profile-image"
                />

                <View style={styles.userInfoContribution}>
                    <Text style={styles.userInfoContributionText}>
                        {userData.contributes ? userData.contributes.filter(item => item && item.trim() !== "").length : 0}
                        {"\n"}Contributions
                    </Text>
                </View>

                <View style={styles.userInfoContribution}>
                    <Text style={styles.userInfoContributionText}>
                        {userData.points || 0}
                        {"\n"}WanderPoints
                    </Text>
                </View>
            </View>

            {/* profile description */}
            <View style={styles.profileDescriptionContainer}>
                <Text style={styles.profileDescriptionText}>
                    {userData.description || "No description provided"}
                </Text>
            </View>

            {/* Contributes and reviews */}
            <View style={styles.contributesAndReviewsContainer} testID="profile-tabs-container">
                <ProfileTabs userData={userData}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#161414',
    },
    centered: {
        justifyContent: 'center',
    },
    header: {
        marginTop: 70,
        flexDirection: 'row',
        width: '100%',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    errorText: {
        color: '#ff5252',
        fontSize: 16,
        textAlign: 'center',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',
    },
    userInfoImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    userInfoContribution: {
        
    },
    userInfoContributionText: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
    profileDescriptionContainer: {
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 20,
    },
    profileDescriptionText: {
        fontSize: 12,
        color: '#fff',
    },
    contributesAndReviewsContainer: {
        marginTop: 20,
    },
    settings: {
        position: 'absolute',
        right: 0,
        width: 50,
        height: 50,
        justifyContent: 'center',
    }
});