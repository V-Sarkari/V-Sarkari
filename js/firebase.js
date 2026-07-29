const firebaseConfig = {
  apiKey: "AIzaSyBP-O6iDerlMBAMufgS4felg1_kv168F-4",
  authDomain: "v-sarkari.firebaseapp.com",
  projectId: "v-sarkari",
  storageBucket: "v-sarkari.firebasestorage.app",
  messagingSenderId: "480075026436",
  appId: "1:480075026436:web:f2c65023bf25e26f762551",
  measurementId: "G-9QJ3GELXKN"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

console.log("Firebase Connected Successfully");
