// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1DKwvIz92Bqa1NvQgNRJX_0kmZNPUYx8",
  authDomain: "sprint-47b69.firebaseapp.com",
  projectId: "sprint-47b69",
  storageBucket: "sprint-47b69.appspot.com",
  messagingSenderId: "854138429117",
  appId: "1:854138429117:web:7159036f265b1d1ec9e1d4",
  measurementId: "G-8VFB38C964",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
