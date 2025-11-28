import '../assets/styles/Home.css';
import { useMemo, useState } from 'react';

const highlightFeatures = [
  {
    icon: '🤖',
    title: 'Adaptive AI Interviewer',
    description: 'Question difficulty adjusts to your confidence and topics that need more depth.',
  },
  {
    icon: '🎯',
    title: 'Focused Skill Domains',
    description: 'Choose from seven in-demand domains and receive questions tailored to each.',
  },
  {
    icon: '🎙️',
    title: 'Voice & Transcript Capture',
    description: 'Speak naturally or type responses—VisionHire records everything for review.',
  },
  {
    icon: '⚡',
    title: 'Actionable Feedback',
    description: 'Get keyword highlights, score rationales, and follow-ups that train for real interviews.',
  },
];

const howSteps = [
  {
    label: 'Upload Resume',
    description: 'Let VisionHire understand your experience before the interview begins.',
  },
  {
    label: 'Choose Your Domain',
    description: 'From full stack to operating systems—select where you want to shine.',
  },
  {
    label: 'Interview in Real-Time',
    description: 'Answer adaptive questions with voice, video, or keyboard input.',
  },
  {
    label: 'Review & Improve',
    description: 'See per-question scores, reasons, and suggested next steps.',
  },
];

function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle('dark-theme');
  };

  const stats = useMemo(
    () => [
      { value: '12k+', label: 'Questions generated' },
      { value: '4.9/5', label: 'Candidate satisfaction' },
      { value: '85%', label: 'Report improved readiness' },
    ],
    [],
  );

  return (
    <div className={`home-wrapper ${darkMode ? 'dark' : ''}`}>
      <div className="gradient-glow glow-one" />
      <div className="gradient-glow glow-two" />
      <header className="header">
        <div className="logo-wrap">
          <span className="logo-icon">🌌</span>
          <h1 className="logo">VisionHire</h1>
        </div>
        <div className="nav-buttons">
          <a href="/login" className="nav-link">
            Login
          </a>
          <a href="/register" className="nav-link filled">
            Create Account
          </a>
          <button onClick={toggleTheme} className="theme-toggle">
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="hero-pill">🚀 New: Domain-specific interview tracks</span>
          <h2>
            Ace your next <span>technical interview</span> with AI-powered practice.
          </h2>
          <p>
            VisionHire blends adaptive questioning, realistic pacing, and instant analytics to help you
            rehearse like it&apos;s the real thing—every single time.
          </p>
          <div className="hero-actions">
            <a href="/interview" className="cta-button primary">
              Start Practicing
            </a>
            <a href="/guidelines" className="cta-button ghost">
              See How It Works
            </a>
          </div>
          <div className="hero-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card card-one">
            <span>✨</span>
            <h4>Adaptive Follow-ups</h4>
            <p>See how your last answer shapes the next question in real time.</p>
          </div>
          <div className="floating-card card-two">
            <span>🧠</span>
            <h4>AI Score Insights</h4>
            <p>Understand each 0-5 score with actionable keywords and reasons.</p>
          </div>
          <div className="floating-orb orb-one" />
          <div className="floating-orb orb-two" />
        </div>
      </section>

      <section className="features">
        <h2>Why candidates choose VisionHire</h2>
        <div className="feature-grid">
          {highlightFeatures.map((feature) => (
            <div key={feature.title} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <h2>The VisionHire flow</h2>
        <div className="how-row">
          {howSteps.map((step) => (
            <div key={step.label} className="how-card">
              <strong>{step.label}</strong>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-copy">
          <h3>Ready to rehearse your next big opportunity?</h3>
          <p>
            Join thousands of engineers who rely on VisionHire to sharpen their skills and walk into
            interviews with confidence.
          </p>
        </div>
        <a href="/setup" className="cta-button banner">
          Begin Setup
        </a>
      </section>
    </div>
  );
}

export default Home;
