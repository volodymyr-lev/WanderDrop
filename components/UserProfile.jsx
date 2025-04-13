import React, {useContext, useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';


export default function UserProfile({navigation}) {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);


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
    }, [user]);

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#24C690" />
            </View>
        );
    }

    console.log(userData);

    return (
        <View style={styles.container}>
            
            {/* header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>{userData.name}</Text>
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
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    }
});