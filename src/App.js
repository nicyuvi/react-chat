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
import { useState, useRef } from 'react';

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
  // reference the dummy div to scroll to
  const dummy = useRef();

  // reference a firestore collection
  const messagesRef = firestore.collection('messages');

  // query for a subset of documents in a collection
  const query = messagesRef.orderBy('createdAt').limit(25);

  // make query and listen to any updates to the data in
  // real time with useCollectionData hook
  const [messages] = useCollectionData(query, { idField: 'id' });

  // stateful values
  const [formValue, setFormValue] = useState('');

  // sendMessage event handler
  // async funtion because it will take time for data
  // to be written to the backend
  const sendMessage = async (e) => {
    // prevent page refresh
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    // write new document to the database

    // returns a Promise resolved with DocumentReference pointing
    // to the newely created object AFTER it has been
    // written to the backend
    await messagesRef.add({
      // values we want to write to database
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    // empty form input on submit
    setFormValue('');

    // scroll to dummy div whenever user sends message
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main>
        {/* if there are messages... */}
        {/* loop over each document and pass into ChatMessage component as prop*/}
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        {/* scroll to this div when new message is rendered */}
        <div ref={dummy}></div>
      </main>
      {/* submit right to database */}
      <form onSubmit={sendMessage}>
        {/* when input changes, we change state value and bind to form input */}
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />

        <button type='submit'>Submit</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  // destructure message document
  const { text, uid, photoURL } = props.message;

  // conditional CSS based on if message was sent or recieved
  // if message uid matches user uid then message is sent
  // otherwise message is received
  const messageClass = uid === auth.currentUser.id ? 'sent' : 'received';

  return (
    // apply conditional CSS class to text message
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt='user' />
      <p>{text}</p>
    </div>
  );
}

export default App;
