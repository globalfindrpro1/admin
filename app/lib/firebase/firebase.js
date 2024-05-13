
import { getAuth } from 'firebase/auth'
import firebase from "firebase/compat/app"
import 'firebase/compat/storage';
import 'firebase/auth';
import "firebase/compat/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeO3VX_pyCxK2yiUiFfUmOk3F8lM_Vvpk",
  authDomain: "global-event-days.firebaseapp.com",
  projectId: "global-event-days",
  storageBucket: "global-event-days.appspot.com",
  messagingSenderId: "279585050257",
  appId: "1:279585050257:web:95a0600f2481c7c1d33930",
  measurementId: "G-BTJ02Q0REG"
}


let app;
// Initialize Firebase
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

export const storageRef = app.storage().ref();
export const db = firebase.firestore();
export const auth = getAuth(app)
export default firebase
