import React, { useState } from 'react';

const API = 'http://localhost:5000/api';

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = mode === 'signup' ? { username, email, password } : { username, password };
      const res = await fetch(`${API}/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Auth failed');
      localStorage.setItem('token', data.token);
      onAuth(data.token);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className='auth-container'> 
      <div className="auth">
        <h2>{mode === 'login' ? 'Login' : 'Sign up'}</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          {mode === 'signup' && (
            <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          )}
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit">{mode === 'login' ? 'Login' : 'Sign Up'}</button>
        </form>
        <div className="auth-toggle">
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}
