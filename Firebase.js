// firebaseConfig.js
import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const firebaseConfig = {
  apiKey: "AIzaSyBtaoNUog-atXxZu95ZaA735PBOwThuL6M",
  authDomain: "landslide-c833e.firebaseapp.com",
  databaseURL: "https://landslide-c833e-default-rtdb.firebaseio.com",
  projectId: "landslide-c833e",
  storageBucket: "landslide-c833e.firebasestorage.app",
  messagingSenderId: "381810903243",
  appId: "1:381810903243:web:402f46b4752ad2d7d0b34e",
  measurementId: "G-J8FDMH8JKS",
};

  firebase.initializeApp(firebaseConfig);
  export const dataRef = firebase.database();
  export default firebase;
