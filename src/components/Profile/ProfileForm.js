import { useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = async (e) => {
      e.preventDefault();
      const enteredNewPassword = newPasswordInputRef.current.value;
      try {
        let response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAjx4FhYqPFnze6jTZ9z7FSAO1We42aynQ',{
          method: 'POST',
          body: JSON.stringify({
            idToken: authCtx.token,
            password: enteredNewPassword,
            returnSecureToken: true
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        let data = await response.json();
        console.log(data);

      } catch (error) {
        console.log(error);
      }
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
