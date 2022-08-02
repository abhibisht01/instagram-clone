import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
const firebaseConfig = {
    apiKey: "AIzaSyD9Fs2x-d-D5ctH2ljtovbb1vbXk_cegpg",
    authDomain: "instagram-clone-976fb.firebaseapp.com",
    projectId: "instagram-clone-976fb",
    storageBucket: "instagram-clone-976fb.appspot.com",
    messagingSenderId: "889786593015",
    appId: "1:889786593015:web:a1000be9076358f076adf2",
    measurementId: "G-CZQK54TN6X"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();    // for database
const auth = firebase.auth();    //for authentication
const storage = firebase.storage(); //for storage in the databse.
// const provider = new firebase.auth.GoogleAuthProvider();// for login google authentication

export { auth, storage };
export default db;