import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordRef.current.value;

    setIsLoading(true);

    let url;

    if(isLogin){
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAjx4FhYqPFnze6jTZ9z7FSAO1We42aynQ';
    }
    else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAjx4FhYqPFnze6jTZ9z7FSAO1We42aynQ';
    }

    try {
        let response =  await fetch(url,{
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true
          }),
          headers:{
            'Content-Type': 'application/json'
          }
     })
        
        let data = await response.json();
        setIsLoading(false);

        if(response.ok){
          authCtx.login(data.idToken);
        }
        else {
          let errorMessage = 'Authentication failed...'
          if(data && data.error && data.error.message){
              errorMessage =  data.error.message;
          }
            throw new Error(errorMessage);
        }
     } catch (error) {
        setIsLoading(false);
        alert(error.message);
     }
    }
    return (
      <section className={classes.auth}>
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={submitHandler} >
          <div className={classes.control}>
            <label htmlFor='email'>Your Email</label>
            <input type='email' id='email' ref={emailInputRef} required />
          </div>
          <div className={classes.control}>
            <label htmlFor='password'>Your Password</label>
            <input
              type='password'
              id='password'
              ref={passwordRef}
              required
            />
          </div>
          <div className={classes.actions}>
          <button>
              {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Create new account')}
            </button>
            <button
              type='button'
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? 'Create new account' : 'Login with existing account'}
            </button>
          </div>
        </form>
      </section>
    );
  }

export default AuthForm;
