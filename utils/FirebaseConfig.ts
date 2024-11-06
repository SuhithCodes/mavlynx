import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAZFP45tG6D-XWhsfq_9Sx8vApNiVMovvc",
  authDomain: "mavlynxs.firebaseapp.com",
  projectId: "mavlynxs",
  storageBucket: "mavlynxs.firebasestorage.app",
  messagingSenderId: "1077987208402",
  appId: "1:1077987208402:web:b02fe1ce629d6b834cd10b",
  measurementId: "G-G96PDHJ9NX",
};

const app = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
