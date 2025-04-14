import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheetMarkerAbout from '../components/BottomSheetMarkerAbout';
import BottomSheetMarkerReviews from '../components/BottomSheetMarkerReviews';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function MarkerTabs({ marker }) {
    const [selectedTab, setSelectedTab] = React.useState('About');

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.tabBar}>
                <TouchableOpacity
                style={[styles.tabButton, selectedTab === 'About' && styles.selectedTab]}
                onPress={() => setSelectedTab('About')}>
                    
                    <Text style={styles.tabText}>About</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.tabButton, selectedTab === 'Reviews' && styles.selectedTab]}
                onPress={() => setSelectedTab('Reviews')}>
                    
                    <Text style={styles.tabText}>Reviews</Text>
                </TouchableOpacity>
            </View>

            {selectedTab === 'About' 
            ? <BottomSheetMarkerAbout marker={marker}/> 
            : <BottomSheetMarkerReviews marker={marker}/>}

        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#161414',
        paddingTop: 10,
        paddingBottom: 5,
        justifyContent: 'space-around',
    },
    tabButton: {
        padding: 10,
    },
    tabText: {
        color: '#fff',
        fontSize: 14,
    },
    selectedTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#24C690',
    },
}) 
