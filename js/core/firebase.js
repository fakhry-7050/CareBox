// Firebase web configuration for CareBox.
// These values identify the Firebase project; never place Admin SDK credentials here.
export const firebaseConfig = {
  apiKey: "AIzaSyBd1sJxybjpE3ic7q0slHG4gPawnzmK5k4",
  authDomain: "carebox-production.firebaseapp.com",
  projectId: "carebox-production",
  storageBucket: "carebox-production.firebasestorage.app",
  messagingSenderId: "479031095758",
  appId: "1:479031095758:web:a567866c33143850d2bb9f",
  measurementId: "G-PN45VRHJRJ"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
