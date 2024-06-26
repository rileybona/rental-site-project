import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  // create a variable to determine whether or not to disable submit button 
  const allowSubmit = (email && username && firstName && lastName && password && confirmPassword) && (username.length > 3) && (password.length > 5)

  // create dynamic class name to allow error message formatting 
  const passwordCl = (errors.confirmPassword ? "password-error" : "");
  const emailCl = (errors.email ? "email-error" : "");
  const usernameCl = (errors.username ? "username-error" : "");

  return (
    <div className='signup-form-modal'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
          <input
            className={emailCl}
            type="text"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        {errors.email && <p>{errors.email}</p>}
          <input
            className={usernameCl}
            type="text"
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        {errors.username && <p>{errors.username}</p>}
          <input
            type="text"
            placeholder='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        {errors.firstName && <p>{errors.firstName}</p>}
          <input
            type="text"
            placeholder='Last Name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        {errors.lastName && <p>{errors.lastName}</p>}
          <input
            className={passwordCl}
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {errors.password && <p>{errors.password}</p>}
          <input
            className={passwordCl}
            type="password"
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit" disabled={!allowSubmit}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
