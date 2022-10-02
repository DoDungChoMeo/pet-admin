// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDrqqdLh-JaR3BmocE4mL1BdCubNEATrII',
  authDomain: 'dodungchomeo.firebaseapp.com',
  projectId: 'dodungchomeo',
  storageBucket: 'dodungchomeo.appspot.com',
  messagingSenderId: '539732335153',
  appId: '1:539732335153:web:fba7116971a3fdf30b5310',
  measurementId: 'G-CVHC0XCEBM',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
