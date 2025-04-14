import React, {useEffect} from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getContributesByUser } from '../firebase/firebase';
import Contribute from './Contribute';
import { ScrollView } from 'react-native-gesture-handler';

export default function Contributes({userData}) {
    const [contributes, setContributes] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    
    useEffect(() => {
        
        const fetchContributes = async () =>{
            const contributesData = await getContributesByUser(userData);
            setContributes(contributesData);
            setLoading(false);
        }

        if(userData?.uid){
            fetchContributes();
        }
        

    }, []);

    if(loading){
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#24C690" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {contributes.map((contribute, index) => (
                <Contribute key={index} contribute={contribute}/>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});