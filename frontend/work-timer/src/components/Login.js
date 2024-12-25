import React, { useState } from 'react';
import './Login.css'
function Login({ setUser }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Login failed');
    }
  };

  return (
    <div className="login-container">
      <h1>Work Clock</h1>
      <form onSubmit={handleLogin}>
        <div>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({...credentials, username: e.target.value})}
        />
        </div>
        <div>
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        />
        </div>
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}  
      </form>

      </div>
  );
}

export default Login;