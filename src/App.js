import React from 'react';
import './App.css';

// import firebase sdk
import firebase from 'firebase/app';

// ES6 equivalent to require - this runs the module's global code, doesn't actually import any values
// import firestore database
import 'firebase/firestore';
// import firebase authentication
import 'firebase/auth';

//import hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// identify our project
firebase.initializeApp({
  apiKey: 'AIzaSyCfwdcdcnsMBIhmo-LTT9SYvmfGVC6hjPE',
  authDomain: 'react-chat-dafd0.firebaseapp.com',
  projectId: 'react-chat-dafd0',
  storageBucket: 'react-chat-dafd0.appspot.com',
  messagingSenderId: '145922981008',
  appId: '1:145922981008:web:c288702998b2ffc834ec15',
  measurementId: 'G-N123SHVR5S',
});

// auth and firestore sdks
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  // takes in instance for the app you would like to monitor
  // returns firebase.user if logged in, or underfined if not
  const [user] = useAuthState(auth);

  return (
    <div className='App'>
      <header className='App-header'></header>
    </div>
  );
}

export default App;
