import { initializeApp } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhT1Tfp8D-TUIy3EtAYgZI3ulf61kwdtw",
  authDomain: "bolbe-dev.firebaseapp.com",
  projectId: "bolbe-dev",
  storageBucket: "bolbe-dev.appspot.com",
  messagingSenderId: "553036248855",
  appId: "1:553036248855:web:60fc5b8b61bf362a60e952",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Connect to Firebase auth
export const auth = getAuth();

