import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

export default function ContributeScreen() {
    return (
        <View style={styles.container}>
            <Text>Contribute Tab</Text>
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