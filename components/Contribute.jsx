
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, Touchable, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { useNavigation } from '@react-navigation/native';


export default function Contribute({contribute}) {
    const [location, setLocation] = useState(null); 
    const [distance, setDistance] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync(); 
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
        
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
            setLoading(false);
        })();
    }, []);

    const calculateDistance = (userLat, userLong) => {
        if (contribute.latitude && contribute.longitude) {
            const R = 6371; // Radius of the Earth 
            const dLat = toRadians(contribute.latitude - userLat);
            const dLong = toRadians(contribute.longitude - userLong);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(userLat)) *
                    Math.cos(toRadians(contribute.latitude)) *
                    Math.sin(dLong / 2) *
                    Math.sin(dLong / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distanceInKm = R * c; 
            setDistance(distanceInKm.toFixed(2));
        }
    };


    const toRadians = (degree) => {
        return (degree * Math.PI) / 180;
    };

    useEffect(() => {
        if (location) {
            calculateDistance(location.latitude, location.longitude);
        }
    }, [location, contribute]);

    return (
        <TouchableOpacity testID = "touchable" style={styles.container} onPress={()=>{navigation.navigate('PlaceDetails',{marker: contribute})}}>
            <Image
                testID='image'
                style={styles.image}
                source={{ uri: contribute.image_url[0] }}
            />

            <View style={styles.descContainer}>
                <Text style={styles.descText}>{contribute.name}</Text>


                <StarRating
                    style={styles.descRating}
                    rating={contribute.average_rating}
                    starSize={20}
                    maxStars={5}
                    starStyle={{marginRight: 5}}
                    onChange={()=>{}}
                    />
            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#393939',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        flexDirection: 'row',
        
    },
    image: {
        width: 120,
        height: 100,
        borderRadius: 10,
    },
    descContainer:{
        marginLeft: 15,
        justifyContent: 'space-around'
    },
    descText:{
        color:'#fff',
        fontWeight: 'bold',
        fontSize: 14,
        maxWidth: 200,
    },
    descRating:{
        
    }
})