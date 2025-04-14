import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getUser } from '../firebase/firebase';

import StarRating from 'react-native-star-rating-widget';

export default function Review({data , pad, backColor}) {

    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const getUserById = async () => {
            try {
                console.log("USER " + data.user_id)

                const u = await getUser(data.user_id);
                setUser(u);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(true);
            }
        }   

        if(data?.id){
            getUserById();
        }
    }, [data.id]);

    if(loading){
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#24C690" />
            </View>
        );
    }

    console.log(user);
    console.log(data);
    
    const exactDate = data.date.toDate().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
    
    return (
        <View style={styles.container} 
            padding={pad} 
            backgroundColor={backColor}>
            
            {/* header */}
            <View style={styles.header}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                        source={{ uri: user.pfp_url }}  
                        
                        resizeMode="cover"
                        style={styles.image}
                        />

                    <Text style={styles.header_text}>
                        {user.name}
                    </Text>

                </View>

                <StarRating
                    rating={data.rating}
                    starSize={20}
                    maxStars={5}
                    starStyle={{marginRight: 5}}
                    onChange={()=>{}}
                    />
            </View>

            {/* review text */}
            <Text style={styles.review_text}>
                {data.text}
            </Text>

            {/* date */}
            <View style={styles.date_container}>  
                <Text style={styles.review_date}>
                    {exactDate}  
                </Text> 
            </View>
        </View>
    );  
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
        borderRadius: 16,
    },
    date_container:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    review_date:{
        color: '#959595',
        fontSize: 12,
        marginTop: 10,
    },
    review_text:{
        color: '#fff',
        fontSize: 14,
        marginTop: 10,
    },
    header:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image:{
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10,
    },
    header_text:{
        color: '#24C690',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 10,
    },
})