// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDKItHFTMjMyr4q9VEQST8hDV3NmiXSwik",
    authDomain: "knight-s-tour-7e888.firebaseapp.com",
    projectId: "knight-s-tour-7e888",
    storageBucket: "knight-s-tour-7e888.firebasestorage.app",
    messagingSenderId: "784679619593",
    appId: "1:784679619593:web:92ac628d76f42acb52bcd8",
    measurementId: "G-55HP0QSZLR"
  };

// Firebase App
const app = initializeApp(firebaseConfig);

// Firebase Auth
const auth = getAuth(app);

export { auth };
