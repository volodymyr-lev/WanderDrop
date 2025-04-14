import React, {useContext, useEffect, useState} from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getUser, getContributesByUser } from '../firebase/firebase';
import Contributes from '../components/Contributes';
import { FontAwesome5 } from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners';

export default function ContributeScreen({navigation}) {
    const { user } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!user?.uid){
                    setLoading(false);
                    return;
                } 
                
                const fetchedUser = await getUser(user.uid);
                setUserInfo(fetchedUser);
                setLoading(false);

            } catch (error) {
                console.error('Error in ContributeScreen:', error);
                setLoading(false);
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
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    console.log("USER STATUS : " + user?.uid);
    console.log("FETCHED USER DATA : " + userInfo?.name);
    
    if(user?.uid)
    {

        console.log("CURRENT USER IN CONTRIBUTE : " + userInfo?.name);
    }
    return (
        <View style={styles.container}>
            {user ? (
                <View style={styles.contributesContainer}>
                    <Text style={styles.contributionText}>
                        My Contributions
                    </Text> 
                    {userInfo?.contributes.length === 0 && (
                        <View style={styles.noContributesContainer}>
                            <Text style={styles.noContributesText}>
                                No contributes yet
                            </Text>
                        </View>
                    )}
                    <Contributes userData={userInfo} navigation={navigation}/>
                </View>
            ) : (
                <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
                    <Text style={styles.loginText}>
                            Please log in to access this feature.
                    </Text>
                </View>
            )}

            
            {user?.uid && <TouchableOpacity style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                backgroundColor: '#24C690',
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center'
            }}
                onPress={()=>navigation.navigate('AddPlace')}
            >   
                <FontAwesome5 name="plus" size={24} color={'#fff'}/>
            </TouchableOpacity>}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#161414'
    },
    loginText: {
        color: '#fff',
    },
    contributesContainer:{
        flex: 1,
        marginTop: 60,
        margin: 20
    },
    contributionText:{
        color: '#fff',
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 20
    },
    noContributesContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noContributesText:{
        color: '#89807A',
        fontSize: 20,
    }
});


