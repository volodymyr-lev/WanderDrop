import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

export default function ExploreScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Explore Tab</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#161414'
    },
    text:{
        color:'#fff'
    },
});