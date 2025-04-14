import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from "firebase/auth";

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
export const db = getFirestore(app);
export const auth = getAuth(app); 

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


export const handleRegister = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const description = "";
        const contributes = [];
        const saved = [];
        const points = 0;
        const visits = [];
        const uid = user.uid;

        await setDoc(doc(db, 'users', user.uid), {
            name,
            email,
            pfp_url: 'https://cdn.drawception.com/drawings/772685/WHMjXsf5s8.png',
            createdAt: new Date(),
            description,
            contributes,
            points,
            saved,
            visits,
            uid,
        });

        console.log('User registered and saved');
    } catch (error) {
        console.error('Registration error:', error);
        alert(error.message);
    }
};

export const getContributesByUser = async (user) => {
    const userContributes = user.contributes || [];
    let contr = [];

    try{
        const contributesRef = collection(db, 'places');
        const snapshot = await getDocs(contributesRef);
        const contributesList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    
        
        contributesList.forEach((contribute)=>{
            if(userContributes.includes(contribute.id)){
                contr.push(contribute);
            }
        })

        return contr;

    } catch (error) {
        console.error('Error while getting contributes:', error);
    }
}