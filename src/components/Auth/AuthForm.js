import { useState, useRef } from 'react';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordRef.current.value;

    if(isLogin){
      setIsLoading(true);
      setTimeout(() => {
        console.log('Login successfully');
        setIsLoading(false);
      }, 500)
    } else{
     try {
        setIsLoading(true);
        let response =  await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAjx4FhYqPFnze6jTZ9z7FSAO1We42aynQ',{
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
        if(response.ok){
          setIsLoading(false);
        }
        else {
          let err = await response.json();
          throw new Error(err.error.message);
        }
     } catch (error) {
        setIsLoading(false);
        alert(error.message);
        console.log(error);
     }
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
};

export default AuthForm;
