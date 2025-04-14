import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getReviewsById } from '../firebase/firebase';
import Review from './Review';
import { ScrollView } from 'react-native-gesture-handler';


export default function BottomSheetMarkerReviews({ marker , backgroundColor}) {
    const [reviews, setReviews] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsData = await getReviewsById(marker.id);
                setLoading(false);
                setReviews(reviewsData);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setLoading(true);
            }
        };

        if(marker?.id){
            fetchReviews();
        }
    }, [marker.id]);

    
    if(loading){
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#24C690" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {reviews.map((review, index) => (
                <Review key={index} data={review}
                    pad={20}
                    backColor={'#393939'}/>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#161414', 
        flex: 1,
        padding: 16,
        maxHeight: '100%',
    },
});