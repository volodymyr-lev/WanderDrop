import React, { useEffect } from 'react'
import { View, Text, StyleSheet,FlatList } from 'react-native';
import WIP from '../WIP/WIP';
import { getMarkers } from '../firebase/firebase';
import { TextInput } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import FoundPlace from '../components/FoundPlace';


export default function GoScreen({navigation}) {
    const [searchQuerry, setSearchQuery] = React.useState('');
    const [markers, setMarkers] = React.useState([]);
    const [filteredMarkers, setFilteredMarkers] = React.useState([]);

    useEffect(() => {
        const fetchMarkers = async () => {
            const fetched = await getMarkers();
            setMarkers(fetched);
        }

        fetchMarkers();
    }, []);

    useEffect(() => {
        if(searchQuerry.length > 0){
            const filtered = markers.filter(marker=>(
                marker.name.toLowerCase().includes(searchQuerry.toLowerCase())
            ))

            setFilteredMarkers(filtered);
        } else {
            setFilteredMarkers([]);
        }
    }, [searchQuerry]);

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <View style={styles.inputLeftPart}>
                    <MaterialIcons name="search" size={24} color="#FFFFFF" />
                    <TextInput
                        style={styles.input}
                        placeholder='Search...'
                        placeholderTextColor='#FFFFFF'
                        onChangeText={text => setSearchQuery(text)}
                        
                    />
                </View>
                <MaterialIcons name="sort" size={24} color="#FFFFFF" />
            </View>

            {searchQuerry.length === 0 && (
                <Text style={styles.idletext}>Go on.</Text>
            )}

            <View style={{width: '100%'}}>
                <FlatList
                    data={filteredMarkers}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <FoundPlace marker={item} navigation={navigation}/>
                    )}

                    style={{
                        width: '100%',
                        height: '100%',
                    }}

                    contentContainerStyle={{
                        alignItems: 'center',
                        width: '100%',
                    }}
                    />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#161414',
        alignItems: 'center',
    },
    idletext:{
        color: '#393939',
        fontSize: 20,
        marginTop: 20,
    },
    inputLeftPart:{
        flexDirection: 'row',
    },
    inputContainer:{
        marginTop:63,
        marginBottom: 30,
        padding: 20,
        width: '85%',
        borderRadius: 16,
        backgroundColor: '#585858',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input:{
        height: '100%',
        width: '80%',
        marginLeft: 10,
        color: '#FFFFFF',
        maxWidth: '80%',
    }
});