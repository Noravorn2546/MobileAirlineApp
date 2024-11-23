import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBaK3D0FE7HLmXHvWXjxsCWLTFAHQUjCCQ",
    authDomain: "mobileairlineapp.firebaseapp.com",
    projectId: "mobileairlineapp",
    storageBucket: "mobileairlineapp.firebasestorage.app",
    messagingSenderId: "595719017534",
    appId: "1:595719017534:web:f5327d96019832faa02d6f",
    measurementId: "G-0F918SNYRR"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
