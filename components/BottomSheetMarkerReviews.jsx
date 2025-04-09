import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WIP from '../WIP/WIP';


export default function BottomSheetMarkerReviews({ marker }) {
    return (
        <View style={styles.container}>
            <Text>Rev</Text>
            <WIP/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        //backgroundColor: '#161414', 
        backgroundColor: 'aqua',
        padding: 16
    },
});