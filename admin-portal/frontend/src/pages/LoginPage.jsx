import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async event => {
    event.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data && response.data.accessToken) {
        window.localStorage.setItem(
          'vrindhavanam_admin_session',
          JSON.stringify({
            token: response.data.accessToken,
            role: 'Admin', // In real app decode JWT for role
            createdAt: new Date().toISOString(),
          }),
        );
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="auth-page auth-page--signin">
      <section className="auth-card auth-card--signin">
        <div className="auth-brand-lockup">
          <img
            className="brand-logo-img"
            src="/images/logo.png"
            alt="Vrindhavanam Estate logo"
          />
          <span className="brand-lockup">
            <span className="brand-title">Vrindhavanam Estate</span>
            <span className="brand-subtitle">HERITAGE SINCE 1932</span>
          </span>
        </div>
        <p className="auth-copy">
          Sign in to access the Enterprise Dashboard.
        </p>

        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <label>
            Email
            <input 
              type="email" 
              placeholder="admin@vrindhavanam.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </label>
          <label>
            Password
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </label>
          <button className="admin-button admin-button--full" type="submit">
            Sign in
          </button>
        </form>
      </section>
    </div>
  );
}
