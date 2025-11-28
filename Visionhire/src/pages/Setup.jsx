import '../assets/styles/Setup.css';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DOMAIN_OPTIONS = [
  { value: 'full stack web development', label: 'Full Stack Web Development', description: 'Frontend, backend, APIs, and deployment workflows.' },
  { value: 'data structures', label: 'Data Structures', description: 'Arrays, trees, graphs, and algorithmic problem solving.' },
  { value: 'computer networks', label: 'Computer Networks', description: 'OSI model, protocols, routing, and network security.' },
  { value: 'operating systems', label: 'Operating Systems', description: 'Processes, threads, scheduling, and memory management.' },
  { value: 'database management systems', label: 'Database Management Systems', description: 'SQL, transactions, indexing, and normalization.' },
  { value: 'object oriented programming', label: 'Object Oriented Programming', description: 'Concepts like inheritance, polymorphism, and design patterns.' },
];

function Setup({ darkMode }) {
  const [cameraStatus, setCameraStatus] = useState('Camera permission not yet requested');
  const [micStatus, setMicStatus] = useState('Microphone permission not yet requested');
  const initialDomain = useMemo(() => {
    if (typeof window === 'undefined') return DOMAIN_OPTIONS[0].value;
    const stored = sessionStorage.getItem('visionhire-selected-domain');
    const exists = DOMAIN_OPTIONS.find((option) => option.value === stored);
    return exists ? exists.value : DOMAIN_OPTIONS[0].value;
  }, []);
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const navigate = useNavigate();

  const requestCameraAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStatus('Camera access granted');
    } catch (err) {
      setCameraStatus('Camera access denied');
    }
  };

  const requestMicAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus('Microphone access granted');
    } catch (err) {
      setMicStatus('Microphone access denied');
    }
  };

  const handleDomainSelect = (value) => {
    setSelectedDomain(value);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('visionhire-selected-domain', value);
    }
  };

  const handleBack = () => {
    navigate('/guidelines');
  };

  const handleStart = () => {
    if (cameraStatus === 'Camera access granted' && micStatus === 'Microphone access granted') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('visionhire-selected-domain', selectedDomain);
      }
      navigate('/interview-start', { state: { domain: selectedDomain } });
    } else {
      alert('Please allow both camera and microphone access to proceed.');
    }
  };

  return (
    <div className={`page-shell setup-page ${darkMode ? 'dark' : ''}`}>
      <div className="page-glow one" />
      <div className="page-glow two" />
      <div className="page-content">
        <header className="setup-header">
          <span className="tag-pill">Step 3 · Prepare your environment</span>
          <h1>
            Configure VisionHire <span>before you interview</span>
          </h1>
          <p>
            Give the platform a clear view and sound of your responses, then pick the domain you’d like
            to focus on. We’ll handle the rest.
          </p>
        </header>

        <section className="domain-section glass-surface">
          <h2>Select your interview domain</h2>
          <p className="domain-subtitle">
            Choose the technical area you want your interview questions to focus on. You can change this before each session.
          </p>
          <div className="domain-grid">
            {DOMAIN_OPTIONS.map((option) => {
              const isSelected = selectedDomain === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`domain-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleDomainSelect(option.value)}
                >
                  <span className="domain-label">{option.label}</span>
                  <span className="domain-description">{option.description}</span>
                  {isSelected && <span className="domain-selected-pill">Selected</span>}
                </button>
              );
            })}
          </div>
        </section>

        <div className="permission-row">
          <div className="permission-card glass-surface">
            <h3>📷 Camera access</h3>
            <p className="permission-desc">Required so VisionHire can observe communication cues.</p>
            <p className={`permission-status ${cameraStatus.includes('granted') ? 'granted' : ''}`}>{cameraStatus}</p>
            <p className="permission-note">
              We only record during interviews for feedback purposes. Footage isn’t shared externally.
            </p>
            <button onClick={requestCameraAccess}>Allow camera</button>
          </div>

          <div className="permission-card glass-surface">
            <h3>🎤 Microphone access</h3>
            <p className="permission-desc">Required to capture your verbal responses with clarity.</p>
            <p className={`permission-status ${micStatus.includes('granted') ? 'granted' : ''}`}>{micStatus}</p>
            <p className="permission-note">
              Audio is transcribed securely to evaluate keywords, depth, and structured reasoning.
            </p>
            <button onClick={requestMicAccess}>Allow microphone</button>
          </div>
        </div>

        <div className="setup-actions">
          <button className="cta-button ghost" onClick={handleBack}>
            ← Back to guidelines
          </button>
          <button className="cta-button primary" onClick={handleStart}>
            Start interview →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Setup;
