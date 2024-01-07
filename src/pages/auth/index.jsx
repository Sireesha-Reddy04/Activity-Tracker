 // pages/auth/index.jsx
 import React from 'react';
 import { useNavigate } from 'react-router-dom';
 import { auth, provider } from '../../config/firebase-config';
 import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; // Correct import
 
 export const Auth = () => {
   const navigate = useNavigate();
 
   const signInWithGoogle = async () => {
     try {
       const result = await signInWithPopup(auth, new GoogleAuthProvider()); // Use GoogleAuthProvider
       const authInfo = {
         userID: result.user.uid,
         name: result.user.displayName,
         profilePhoto: result.user.photoURL,
         isAuth: true,
       };
       localStorage.setItem('auth', JSON.stringify(authInfo));
 
       // Check if authentication was successful before navigating
       if (result.user.uid) {
         navigate('/activity--tracker');
       } else {
         console.error('Authentication failed.');
       }
     } catch (error) {
       console.error('Authentication failed:', error.message);
     }
   };
 
   return (
     <div className="login-page">
       <p>Sign-In with Google to continue</p>
       <button className="login-with-google-btn" onClick={signInWithGoogle}>
         Sign-In with Google
       </button>
     </div>
   );
 };