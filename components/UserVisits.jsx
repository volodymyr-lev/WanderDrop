import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WIP from '../WIP/WIP';

export default function UserVisits({userData}) {

    return (
        <View style={styles.container}>
            {userData.visits.filter(item=>item.trim() !== "").length === 0 ?(
                <Text style={{
                    color: '#8E8E8E',
                    marginTop: 90,
                    fontWeight: 'bold'
                }}> You haven't visited any place yet</Text>
            ) : (
                <WIP/>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
});