// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA3ecMiFFfSDrVOV_Exjpdiw8ceVcS434c",
  authDomain: "fir-resume-app.firebaseapp.com",
  projectId: "fir-resume-app",
  storageBucket: "fir-resume-app.appspot.com",
  messagingSenderId: "337503710284",
  appId: "1:337503710284:web:65ade82b8335e491e4d8e9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

