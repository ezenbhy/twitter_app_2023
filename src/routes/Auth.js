import React, { useState } from 'react';
import {authService} from 'fbase';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword , GoogleAuthProvider , GithubAuthProvider ,signInWithPopup} from "firebase/auth";
import { async } from '@firebase/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthForm from 'components/Authform';
import "styles/auth.scss";

function Auth() {

  const onSocialClick = async (e) => {
    console.log('e.target.name->',e.target.name);
    const {target:{name}} = e;
    let provider;
    if(name === "google"){
      provider = new GoogleAuthProvider();

    }else if(name === "github"){
      provider = new GithubAuthProvider();

    }
    const data = await signInWithPopup(authService, provider);
    console.log('data->',data);
  }

  return (
    <div className="authContainer">
      <FontAwesomeIcon icon="fa-brands fa-twitter" size='3x' color={"#04AAFF"} 
      style={{marginBottom:30}}/>
      <AuthForm />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon="fa-brands fa-google" />
          </button>
        <button onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon="fa-brands fa-github" />
          </button>
      </div>
    </div>
  )
}

export default Auth