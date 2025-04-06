import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

export default function SavedScreen() {
    return (
        <View style={styles.container}>
            <Text>Saved Tab</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});