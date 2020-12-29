import React from 'react';
import './App.css';

// import firebase sdk
import firebase from 'firebase/app';

// ES6 equivalent to require - this runs the module's global code,
// doesn't actually import any values
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
      <header>
        <SignOut />
      </header>
      <section>
        {/* if user is defined, show ChatRoom. If not, show SignIn */}
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

// SignIn component
function SignIn() {
  const signInWithGoogle = () => {
    // instantiate Google auth provider
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

// SignOut component
function SignOut() {
  return (
    // check to see if we have current user
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

// ChatRoom component
function ChatRoom() {
  // reference a firestore collection
  const messagesRef = firestore.collection('messages');

  // query for a subset of documents in a collection
  const query = messagesRef.orderBy('createdAt').limit(25);

  // make query and listen to any updates to the data in
  // real time with useCollectionData hook
  const [messages] = useCollectionData(query, { idField: 'id' });

  return (
    <>
      <div>
        {/* loop over each document and pass into ChatMessage component as prop*/}
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </div>
      <div></div>
    </>
  );
}

function ChatMessage(props) {
  // destructure message document
  const { text, uid } = props.message;

  return <p>{text}</p>;
}

export default App;
