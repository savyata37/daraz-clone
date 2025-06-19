import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/SignForm.module.css';

function SignIn({ setIsLoggedIn }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('✅ Login successful!');
      setIsLoggedIn(true);        // ✅ mark user as logged in
      navigate('/');              // ✅ redirect to homepage
    } else {
      alert('❌ Invalid email or password');
    }
  };

  return (
     <div className="page">
    <form onSubmit={handleSubmit} className={styles.signForm}>

      <p>
       <h1>Login</h1>
      </p>
     
      <p>
        <b>Email{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}</b>{'\u00A0'}{'\u00A0'}

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
      </p>
      <p>
        <b>Password{'\u00A0'}</b>{'  '}
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="Password"
          required
        />
      </p><p>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}
       <button type="submit" className={styles['submit-button']}>Login</button></p>
    </form>
    
      <footer style={{ background: "#f9f9f9", padding: "2px", marginTop: "4rem" }}>
        <p style={{ textAlign: 'center', color: '#666' }}>© 2025 YourSite. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default SignIn;
