import React, { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


const App = () => {

  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
    success: false,
    error: ''
  })

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        // console.log(displayName,email,photoURL);
      })
      .catch(err => console.log(err));
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUser(signedOutUser)
      })
      .catch(err => console.log(err));
  }

  const handleSubmit = (e) => {
    if (user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          // Signed in 
          // var user = userCredential.user;
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);

        })
        .catch((err) => {
          const newUserInfo = { ...user };
          newUserInfo['error'] = err.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  }

  const handleChange = (e) => {
    let isFieldValid = true;

    if (e.target.name === 'email') {
      const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value);
      isFieldValid = isEmailValid;
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /[0-9]/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider)
      .then((result) => {
        // /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        const user = result.user;
        console.log('fb user: ', user);

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(errorMessage, errorCode);
      });
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      {
        user.isSignedIn ? <button onClick={handleSignOut} style={{ color: 'red' }}>Sign Out</button> : <button onClick={handleSignIn} style={{ color: 'red' }}>Sign In</button>
      }
      <br />
      <button onClick={handleFbSignIn}>Fb Sign In</button>

      <h1>Our own Authentication</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>password: {user.password}</p>
      <form onClick={handleSubmit} action="">
        <br />
        <input onBlur={handleChange} name='name' type="text" placeholder='enter name' />
        <br />
        <input onBlur={handleChange} type="email" name="email" placeholder='enter email' required />
        <br />
        <input onBlur={handleChange} type="password" name="password" placeholder='enter password' required />
        <br />
        <input type="submit" value="Submit" />
      </form>
      {
        user.success ? <h4 style={{ color: 'green' }}>Successfully Registration</h4> :
          <h4 style={{ color: 'red' }}>{user.error}</h4>
      }
    </div>
  );
};

export default App;