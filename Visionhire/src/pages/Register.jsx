import '../assets/styles/Form.css';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api.js';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const highlights = useMemo(
    () => [
      'Gain access to adaptive, domain-focused interview prep.',
      'Receive instant analytics and score explanations after each session.',
      'Unlock resume-personalised interviews in under two minutes.',
    ],
    [],
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setMessage(data.message || 'Registration failed.');
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
          <span className="form-pill">Join VisionHire</span>
          <h2>Create your account</h2>
          <p>Set up your profile so we can tailor every interview session to your goals.</p>
        </div>
        <form onSubmit={handleSubmit} className="form-fields">
          <div className="input-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
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
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="cta-button primary full-width">
            Sign Up
          </button>
        </form>
        {message && <p className="form-message">{message}</p>}
        <div className="form-footer">
          <span>Already have an account?</span>
          <a href="/login">Login instead</a>
        </div>
      </div>
      <aside className="form-side-card">
        <h3>Why candidates register</h3>
        <ul>
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default Register;
