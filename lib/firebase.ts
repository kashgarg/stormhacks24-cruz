import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAlbPSv1Vd0eEzXzWaWRLRNlOz-dyxgi3U",
    authDomain: "cruz-3c3c4.firebaseapp.com",
    projectId: "cruz-3c3c4",
    storageBucket: "cruz-3c3c4.appspot.com",
    messagingSenderId: "753797296187",
    appId: "1:753797296187:web:925ea0b73ecdde88322c1e",
    measurementId: "G-92K9F9XL59"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };