import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQmPfcAjMC9kGnFEdABbwkdcM5ZE8ohWc",
  authDomain: "intelligentqueue-c93a8.firebaseapp.com",
  databaseURL: "https://intelligentqueue-c93a8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "intelligentqueue-c93a8",
  storageBucket: "intelligentqueue-c93a8.appspot.com",
  messagingSenderId: "810444015641",
  appId: "1:810444015641:web:c1d0f97ccc4f2a0ccd4288",
  measurementId: "G-7NHGWNMZX7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
