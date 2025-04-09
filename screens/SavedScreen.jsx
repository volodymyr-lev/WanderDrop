import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import WIP from '../WIP/WIP';

export default function SavedScreen() {
    return (
        <View style={styles.container}>
            <Text>Saved Tab</Text>
            <WIP/>
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