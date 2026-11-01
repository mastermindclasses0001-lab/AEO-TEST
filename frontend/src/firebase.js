import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrJcGnLmOSgZSPUaAgdBTQALUyeD5ZCZc",
  authDomain: "aeo-test-73e06.firebaseapp.com",
  projectId: "aeo-test-73e06",
  storageBucket: "aeo-test-73e06.firebasestorage.app",
  messagingSenderId: "711045599204",
  appId: "1:711045599204:web:99f289d5f4341eab7101f1",
  measurementId: "G-T59CK1C7B7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
