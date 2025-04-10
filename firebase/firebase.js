import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyC4qFVXwrR9mRs8XoRFE0yFf84bDDIqv7Q",
  authDomain: "wanderdrop-e0719.firebaseapp.com",
  projectId: "wanderdrop-e0719",
  storageBucket: "wanderdrop-e0719.firebasestorage.app",
  messagingSenderId: "403745517696",
  appId: "1:403745517696:web:9e33a49f2ffca0cfb27665",
  measurementId: "G-P9P318H85T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getMarkers = async () => {
    try {
        const markersCollection = collection(db, 'places');
        const snapshot = await getDocs(markersCollection);

        const markersList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return markersList;
    } catch (error) {
        console.error('Error while getting map marks:', error);
        return [];
    }
};

export const getReviewsById = async (id) => {
    try{
        const reviewsRef = collection(db, 'places', id, 'reviews'); 
        const snapshot = await getDocs(reviewsRef);
        const reviewsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return reviewsList;
    }  catch (error) {
        console.error('Error while getting reviews:', error);
        return [];
    }
}

export const getUser = async (id) => {
    try{
        
        const userRef = doc(db, 'users', id); 
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
            return {
                id: snapshot.id,
                ...snapshot.data(),
            };
        } else {
            console.log("No such document!");
            return null;
        }

    }  catch (error) {
        console.error('Error while getting User:', error);
        return [];
    }
}