import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

function LoginFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // handle this strange error situation

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const response = await res.json();
        // console.log("~login form: response object-- ", response);
        setErrors(response.errors.message);
      });
  };

  // create a dynamic class name for error styling 
  const loginCl = ((errors.length > 0) ? "login-error" : "");

  // create an onClick function to log-in a demo user 
  const demoUserLogIn = async(e) => {
    e.preventDefault();
    const response = await dispatch(sessionActions.login({ "credential": 'Demo-lition', "password": 'password'}));
    if (response.ok) {
      navigate('/');
      closeModal();
    }
  }

  return (
    <div className='login-form-modal'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
          <input
            className={loginCl}
            type="text"
            placeholder='Username or Email'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <input
            className={loginCl}
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {(errors.length > 0) && <p className='login-error-message'>{errors}</p>}
        <button className='form-submit-button' type="submit" disabled={password.length < 6 || credential.length < 4}>Log In</button>
        <button className='demo-user-button' type='button' onClick={(e)=> demoUserLogIn(e)}>Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
