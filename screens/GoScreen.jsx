import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import WIP from '../WIP/WIP';

export default function GoScreen() {
    return (
        <View style={styles.container}>
            <Text>Go Tab</Text>
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