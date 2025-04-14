import React, {useContext, useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import ProfileTabs from '../navigation/ProfileTabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';


export default function UserProfile({navigation}) {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    navigation = useNavigation()

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    }
                } catch (e) {
                    console.error("Error fetching user data: ", e);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();

        const eventListener = EventRegister.addEventListener('MARKERS_UPDATED', async ()=>{
            console.log("Fetching user from event");

            fetchUserData();
        })

        return () => {
            EventRegister.removeEventListener(eventListener);
        };

    }, [user]);

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#24C690" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            
            {/* header */}
            <View style={[styles.header, {justifyContent: 'center', alignItems: 'center', marginBottom: 10}]}>
                <Text style={styles.headerText}>{userData.name}</Text>

                <TouchableOpacity style={styles.settings} onPress={()=>{navigation.navigate('Settings')}}>
                    <FontAwesome5 name="cog" size={24} color={'#fff'}/>
                </TouchableOpacity>
            </View>

            {/* userInfo */}
            <View style={styles.userInfoContainer}>
                <Image 
                    style={styles.userInfoImage}
                    source={{uri: userData.pfp_url}}
                />

                <View style={styles.userInfoContribution}>
                    <Text style={styles.userInfoContributionText}>
                        {userData.contributes.filter(item=>item.trim() !== "").length}
                        {"\n"}Contributions
                    </Text>
                </View>

                
                <View style={styles.userInfoContribution}>
                    <Text style={styles.userInfoContributionText}>
                        {userData.points}
                        {"\n"}WanderPoints
                    </Text>
                </View>
            </View>

            {/* profile description */}
            <View style={styles.profileDescriptionContainer}>
                <Text style={styles.profileDescriptionText}>
                    {userData.description}
                </Text>
            </View>

            {/* Contributes and reviews */}
            <View style={styles.contributesAndReviewsContainer}>
                <ProfileTabs userData={userData}/>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#161414',
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
    userInfoContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',
    },
    userInfoImage:{
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    userInfoContribution:{

    },
    userInfoContributionText:{
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
    profileDescriptionContainer:{
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 20,
    },
    profileDescriptionText:{
        fontSize: 12,
        color: '#fff',
    },
    contributesAndReviewsContainer:{
        marginTop: 20,

    },
    settings:{
        position: 'absolute',
        right: 0,
        width: 50,
        height: 50,
        justifyContent: 'center',

    }
});