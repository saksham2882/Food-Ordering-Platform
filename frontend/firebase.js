// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "yummigo-food-delivery.firebaseapp.com",
    projectId: "yummigo-food-delivery",
    storageBucket: "yummigo-food-delivery.firebasestorage.app",
    messagingSenderId: "520786550551",
    appId: "1:520786550551:web:e0302b4dc42fd75536a152"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { app, auth }