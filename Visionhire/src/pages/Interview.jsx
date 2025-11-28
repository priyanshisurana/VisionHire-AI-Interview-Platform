import '../assets/styles/Interview.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchInterviewData } from '../services/api';

function Interview({ darkMode }) {
  const [resume, setResume] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviewData().then((data) => {
      if (data) {
        console.log(data.message);
      }
    });
  }, []);

  const uploadTips = useMemo(
    () => [
      'Highlight recent projects that demonstrate measurable impact.',
      'Add tech stack details so VisionHire can tailor questions to you.',
      'Keep the file updated—replace it whenever your experience grows.',
    ],
    [],
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setResume(file);
    } else {
      alert('File must be PDF, DOC, or DOCX and under 10MB.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleContinue = () => {
    if (resume) {
      navigate('/guidelines');
    } else {
      alert('Please upload your resume before continuing.');
    }
  };

  return (
    <div className={`page-shell interview-page ${darkMode ? 'dark' : ''}`}>
      <div className="page-glow one" />
      <div className="page-glow two" />
      <div className="page-content">
        <div className="interview-header">
          <span className="tag-pill">Step 1 · Personalise your interview</span>
          <h1>
            Upload your resume <span>to tailor every question</span>
          </h1>
          <p>
            VisionHire analyses your experience to craft questions that match your background and
            target roles. Files stay private and are only used to customise your interview.
          </p>
        </div>

        <div className="interview-grid">
          <div className="upload-panel glass-surface">
            <div className="upload-header">
              <h2>Resume upload</h2>
              <p>Supported formats: PDF, DOC, DOCX — max size 10MB.</p>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div
              className={`upload-dropzone ${resume ? 'has-file' : ''}`}
              role="button"
              tabIndex={0}
              onClick={triggerFileInput}
              onKeyDown={(e) => e.key === 'Enter' && triggerFileInput()}
            >
              <div className="dropzone-icon">📄</div>
              <div>
                <p>Drag & drop your resume or click to browse</p>
                <span>We’ll parse skills, projects, and experience to personalise your practice.</span>
              </div>
              <button className="cta-button ghost" type="button">
                Choose file
              </button>
            </div>
            {resume && <p className="file-chip">Uploaded: {resume.name}</p>}

            <div className="upload-actions">
              <button className="cta-button ghost" type="button" onClick={handleBack}>
                ← Back to home
              </button>
              <button className="cta-button primary" type="button" onClick={handleContinue}>
                Continue to guidelines
              </button>
            </div>
          </div>

          <aside className="insight-panel glass-surface">
            <h3>What makes a great upload?</h3>
            <ul>
              {uploadTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <div className="insight-divider" />
            <h4>Need inspiration?</h4>
            <p>Clean formatting, concise bullet points, and quantifiable results help VisionHire generate more accurate questions.</p>
          </aside>
        </div>

        <section className="feature-highlight">
          <div className="feature-card glass-surface">
            <span className="feature-icon">✨</span>
            <h4>Clear narrative</h4>
            <p>Structure your experience chronologically to reveal career growth.</p>
          </div>
          <div className="feature-card glass-surface">
            <span className="feature-icon">🧩</span>
            <h4>Skill keywords</h4>
            <p>Add tools and frameworks so we can assess what matters most to you.</p>
          </div>
          <div className="feature-card glass-surface">
            <span className="feature-icon">🚀</span>
            <h4>Project highlights</h4>
            <p>Detail outcomes and metrics to trigger impact-focused questions.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Interview;

