import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Contributes from '../components/Contributes';
import UserVisits from '../components/UserVisits';

const Tab = createBottomTabNavigator();

export default function ProfileTabs({userData}) {
    const [selectedTab, setSelectedTab] = React.useState('Contributes');

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.tabBar}>
                <TouchableOpacity
                style={[styles.tabButton, selectedTab === 'Contributes' && styles.selectedTab]}
                onPress={() => setSelectedTab('Contributes')}>
                    
                    <Text style={styles.tabText}>Contributes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.tabButton, selectedTab === 'Visits' && styles.selectedTab]}
                onPress={() => setSelectedTab('Visits')}>
                    
                    <Text style={styles.tabText}>Visits</Text>
                </TouchableOpacity>
            </View>

            {selectedTab === 'Contributes' 
            ? <Contributes userData={userData}/> 
            : <UserVisits userData={userData}/>}

        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        width: '100%',
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
