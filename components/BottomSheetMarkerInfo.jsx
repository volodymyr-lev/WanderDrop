import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MarkerTabs from '../navigation/MarkerTabs';

export default function BottomSheetMarkerInfo({ marker }) {
    if (!marker) return null;

    return (
        <View style={styles.container}>
            <MarkerTabs marker={marker} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
});