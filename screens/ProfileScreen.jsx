import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import WIP from '../WIP/WIP';

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text>Profile Tab</Text>
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