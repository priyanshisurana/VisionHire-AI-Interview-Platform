import '../assets/styles/Form.css';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const quickTips = useMemo(
    () => [
      'Use the email you registered with VisionHire.',
      'Keep your device camera and mic ready for faster setup.',
      'Need an account? Switch to registration in one tap.',
    ],
    [],
  );

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const apiBase = window.location.origin.replace(/:[0-9]+$/, ':5000');
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1200);
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="form-page">
      <div className="form-glow glow-one" />
      <div className="form-glow glow-two" />
      <div className="form-card glass-card">
        <div className="form-header">
          <span className="form-pill">Welcome back</span>
          <h2>Log in to VisionHire</h2>
          <p>Pick up where you left off and keep sharpening your interview skills.</p>
        </div>
        <form onSubmit={handleSubmit} className="form-fields">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="cta-button primary full-width">
            Login & Continue
          </button>
        </form>
        {message && <p className="form-message">{message}</p>}
        <div className="form-footer">
          <span>New here?</span>
          <a href="/register">Create an account</a>
        </div>
      </div>
      <aside className="form-side-card">
        <h3>Quick tips</h3>
        <ul>
          {quickTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default Login;
