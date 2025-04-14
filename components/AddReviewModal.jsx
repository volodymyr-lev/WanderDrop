import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function AddReviewModal({ visible, onClose, placeId, user, onReviewAdded }) {
    const [text, setText] = useState('');
    const [rating, setRating] = useState('');

    const handleSubmit = async () => {
        if (!text || !rating) return;

        const review = {
            text,
            rating: parseInt(rating),
            user_id: user.uid,
            date: new Date(),
        };

        try {
            const reviewsRef = collection(db, 'places', placeId, 'reviews');
            await addDoc(reviewsRef, review);
            setText('');
            setRating('');
            onClose();
            onReviewAdded && onReviewAdded(); 
        } catch (err) {
            console.log("Error adding review:", err);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add Review</Text>
                    <TextInput
                        placeholder="Your review"
                        placeholderTextColor="#aaa"
                        style={styles.input}
                        value={text}
                        onChangeText={setText}
                    />
                    <TextInput
                        placeholder="Rating (1-5)"
                        placeholderTextColor="#aaa"
                        style={styles.input}
                        keyboardType="numeric"
                        value={rating}
                        onChangeText={setRating}
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
                        <Text style={{ color: '#aaa' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#222',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
    },
    submitButton: {
        backgroundColor: '#24C690',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
