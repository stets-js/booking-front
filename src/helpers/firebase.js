// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCj-uDzFWC5gKx0tpwhqmknz4e3aiMaLjg',
  authDomain: 'goiteens-418514.firebaseapp.com',
  projectId: 'goiteens-418514',
  storageBucket: 'goiteens-418514.appspot.com',
  messagingSenderId: '229360019898',
  appId: '1:229360019898:web:5fd98e091743cc871c1583',
  measurementId: 'G-KR3YZXS41K'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
