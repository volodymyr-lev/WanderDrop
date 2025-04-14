import React, {useContext} from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext, logout } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase'; 
import { useNavigation } from '@react-navigation/native';


export default function Settings() {
    const {user} = useContext(AuthContext);
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button 
                    style = {styles.button}
                    title={'Log out'}    
                    color={'#fff'}
                    onPress={()=>{
                        logout();
                        navigation.goBack();
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#161414',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer:{
        width: 200,
        height: 50,
        backgroundColor: '#24C690',
        borderRadius: 15,
    }
})