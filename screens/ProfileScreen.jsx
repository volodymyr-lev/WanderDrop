import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import LoginRegister from '../components/LoginRegister';
import UserProfile from '../components/UserProfile';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { handleRegister} from '../firebase/firebase'


export default function ProfileScreen() {
    const {user, loading} = useContext(AuthContext);

    if (loading) return <Text>Loading...</Text>;

    return (
        <View style={styles.container}>
            {user ? (
                <UserProfile/>
            ) : (
                <LoginRegister
                    onLogin={(email,pass) =>{
                        console.log('Login', email, pass);
                        signInWithEmailAndPassword(auth, email, pass)
                            .then((userCred) =>{ console.log('User logged in:', userCred.user.email) })
                                .catch(err => {
                                    console.error(err.message)
                                    alert(err.message);
                                });
                    }}
                    onRegister={handleRegister}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,

    },
});