
// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();
import { FunctionParser } from "firebase-backend";
import admin = require("firebase-admin");

// Initialise the admin functionality for the firebase backend
admin.initializeApp();


// if (process.env.FUNCTIONS_EMULATOR) {
//   console.log("We are running emulators locally.");

//   const populator = new FakeDataPopulator(firestoreDatabase);
//   populator.generateFakeData();
// }

// exports = new FunctionParser(__dirname, ).exports;