import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore'

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