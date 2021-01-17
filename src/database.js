import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/storage'

firebase.initializeApp({
    apiKey: "AIzaSyBjlk8hQgXudU-B2RJqT2BNsefx6t8OTOA",
    authDomain: "curator-db6a9.firebaseapp.com",
    projectId: "curator-db6a9",
    storageBucket: "curator-db6a9.appspot.com",
    messagingSenderId: "144200887725",
    appId: "1:144200887725:web:efebd6de2b2ab892024524",
    measurementId: "G-FF3VR6CV1K"
})

const db = firebase.firestore()
const storage = firebase.storage()


export { db, firebase, storage }