
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Linking , ActivityIndicator} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const openInGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => console.error("Error opening map", err));
  };
  

  export default function OpenMapButton({ latitude, longitude }) {
    const isLoading = !latitude || !longitude;
  
    return (
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#3EC3FF" />
        ) : (
          <TouchableOpacity
            onPress={() => openInGoogleMaps(latitude, longitude)}
            style={styles.button}
          >
            <FontAwesome5 name="walking" size={28} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    );
  } 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        right: 0,
        marginTop:20,
        zIndex: 1000, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#24C690',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, 
    },
    buttonImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
  });