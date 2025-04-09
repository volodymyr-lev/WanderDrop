import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BottomSheetMarkerAbout({ marker }) {
    return (
        <View style={styles.container}>
            <Text>Ab</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

        backgroundColor: 'aqua', 
        padding: 16
    },
});