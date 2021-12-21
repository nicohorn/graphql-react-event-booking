// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import '/firebase-admin'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCKugAwn5Rv9VbtViBrdBIrcMxFPWlybvc",
    authDomain: "origen-967ef.firebaseapp.com",
    projectId: "origen-967ef",
    storageBucket: "origen-967ef.appspot.com",
    messagingSenderId: "811512994753",
    appId: "1:811512994753:web:78d1d478a30866f495ad40",
    measurementId: "G-N5LQRMC4TN"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const storage = firebase.storage();

export default firebase;