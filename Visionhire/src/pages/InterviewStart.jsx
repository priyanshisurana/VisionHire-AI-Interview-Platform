// frontend/src/pages/InterviewStart.jsx
import '../assets/styles/InterviewStart.css';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api.js';

const DOMAIN_OPTIONS = [
  { value: 'full stack web development', label: 'Full Stack Web Development' },
  { value: 'data structures', label: 'Data Structures' },
  { value: 'computer networks', label: 'Computer Networks' },
  { value: 'operating systems', label: 'Operating Systems' },
  { value: 'database management systems', label: 'Database Management Systems' },
  { value: 'object oriented programming', label: 'Object Oriented Programming' },
];

const DOMAIN_LOOKUP = DOMAIN_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

const DEFAULT_DOMAIN = DOMAIN_OPTIONS[0].value;

function InterviewStart({ darkMode }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [time, setTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [interviewId, setInterviewId] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [warning, setWarning] = useState('');
  const [warningShown, setWarningShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const MAX_QUESTIONS = 15;

  const initialDomain = useMemo(() => {
    const fromState = location.state?.domain;
    if (fromState && DOMAIN_LOOKUP[fromState]) return fromState;
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('visionhire-selected-domain');
      if (stored && DOMAIN_LOOKUP[stored]) return stored;
    }
    return DEFAULT_DOMAIN;
  }, [location.state]);

  const [domain, setDomain] = useState(initialDomain);

  useEffect(() => {
    if (typeof window !== 'undefined' && domain) {
      sessionStorage.setItem('visionhire-selected-domain', domain);
    }
  }, [domain]);

  const domainLabel = useMemo(() => {
    if (!domain) return DOMAIN_LOOKUP[DEFAULT_DOMAIN];
    return DOMAIN_LOOKUP[domain] || domain;
  }, [domain]);

  // 🎤 Voice recognition setup
  // const [listening, setListening] = useState(false);
  // const recognitionRef = useRef(null);
  // const shouldListenRef = useRef(false);
  // const accumulatedFinalTextRef = useRef(''); // All final transcripts accumulated
  // const lastInterimTextRef = useRef(''); // Last interim text to remove

  // useEffect(() => {
  //   if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
  //     console.warn('Speech recognition not supported in this browser.');
  //     return;
  //   }

  //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //   const recognition = new SpeechRecognition();
    
  //   // Enable continuous listening and interim results
  //   recognition.continuous = true;
  //   recognition.interimResults = true;
  //   recognition.lang = 'en-US';

  //   recognition.onstart = () => {
  //     setListening(true);
  //     console.log('Voice recognition started');
  //   };

  //   recognition.onend = () => {
  //     console.log('Voice recognition ended');
  //     setListening(false);
  //     // Clear interim text when recognition ends
  //     lastInterimTextRef.current = '';
  //     // Auto-restart if we're still supposed to be listening
  //     if (shouldListenRef.current && recognitionRef.current) {
  //       setTimeout(() => {
  //         try {
  //           if (shouldListenRef.current && recognitionRef.current) {
  //             recognitionRef.current.start();
  //           }
  //         } catch (err) {
  //           console.log('Could not restart recognition:', err);
  //           setListening(false);
  //         }
  //       }, 100);
  //     }
  //   };

  //   recognition.onerror = (event) => {
  //     console.error('Speech recognition error:', event.error);
  //     if (event.error === 'no-speech') {
  //       // This is normal, just continue listening
  //       return;
  //     }
  //     if (event.error === 'aborted') {
  //       setListening(false);
  //       shouldListenRef.current = false;
  //       return;
  //     }
  //     // For other errors, stop listening
  //     setListening(false);
  //     shouldListenRef.current = false;
  //   };

  //   recognition.onresult = (event) => {
  //     // Process only NEW results (from resultIndex onwards) to avoid duplicates
  //     let newFinalText = '';
  //     let latestInterim = '';

  //     // Process only new results
  //     for (let i = event.resultIndex; i < event.results.length; i++) {
  //       const transcript = event.results[i][0].transcript.trim();
  //       if (!transcript) continue;
        
  //       if (event.results[i].isFinal) {
  //         // Add new final results to accumulated text
  //         newFinalText += transcript + ' ';
  //       } else {
  //         // Keep the latest interim result
  //         latestInterim = transcript;
  //       }
  //     }

  //     // Update the answer
  //     setAnswer((prevAnswer) => {
  //       let currentText = prevAnswer;
        
  //       // Remove previous interim text if it exists
  //       if (lastInterimTextRef.current) {
  //         const toRemove = lastInterimTextRef.current.trim();
  //         if (currentText.endsWith(toRemove)) {
  //           currentText = currentText.slice(0, -toRemove.length).trim();
  //         }
  //       }
        
  //       // Add new final text
  //       if (newFinalText.trim()) {
  //         accumulatedFinalTextRef.current += newFinalText.trim() + ' ';
  //         currentText = accumulatedFinalTextRef.current.trim();
  //         lastInterimTextRef.current = ''; // Clear interim when we get final
  //       }
        
  //       // Add new interim text
  //       if (latestInterim) {
  //         lastInterimTextRef.current = latestInterim;
  //         return currentText + (currentText ? ' ' : '') + latestInterim;
  //       }
        
  //       return currentText;
  //     });
  //   };

  //   recognitionRef.current = recognition;
    
  //   // Cleanup on unmount
  //   return () => {
  //     shouldListenRef.current = false;
  //     if (recognitionRef.current) {
  //       try {
  //         recognitionRef.current.stop();
  //       } catch (err) {
  //         // Ignore errors during cleanup
  //       }
  //     }
  //   };
  // }, []);

  // const handleVoiceToggle = () => {
  //   const recog = recognitionRef.current;
  //   if (!recog) {
  //     alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or another Chromium-based browser.');
  //     return;
  //   }
    
  //   if (listening) {
  //     // Stop listening
  //     shouldListenRef.current = false;
  //     // Commit any remaining interim text to final before clearing
  //     const remainingInterim = lastInterimTextRef.current;
  //     if (remainingInterim) {
  //       accumulatedFinalTextRef.current += remainingInterim + ' ';
  //       setAnswer(accumulatedFinalTextRef.current.trim());
  //     }
  //     lastInterimTextRef.current = ''; // Clear interim transcript
  //     try {
  //       recog.stop();
  //       setListening(false);
  //     } catch (err) {
  //       console.error('Error stopping recognition:', err);
  //       setListening(false);
  //     }
  //   } else {
  //     // Start listening
  //     shouldListenRef.current = true;
  //     // Initialize with current answer (preserve manually typed text)
  //     accumulatedFinalTextRef.current = answer.trim();
  //     lastInterimTextRef.current = '';
  //     try {
  //       recog.start();
  //       setListening(true);
  //     } catch (err) {
  //       console.error('Error starting recognition:', err);
  //       shouldListenRef.current = false;
  //       alert('Could not start voice recognition. Please check your microphone permissions.');
  //     }
  //   }
  // };
  //🎤 Voice recognition setup
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => console.error('Speech error:', event.error);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log('Heard:', transcript);
      setAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
    };

    recognitionRef.current = recognition;
  }, []);

  const handleVoiceToggle = () => {
    const recog = recognitionRef.current;
    if (!recog) return alert('Speech recognition not supported in this browser.');
    if (listening) recog.stop();
    else recog.start();
  };

  // 🕒 Timer - countdown 1 minute per question
  useEffect(() => {
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Don't start timer if time is 0 or less
    if (time <= 0) return;

    // Start new timer
    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleNext(); // Auto move to next question when timer ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [time]);

  // 🚀 Start Interview
  useEffect(() => {
    if (!domain) return;
    async function startInterview() {
      setStatusMsg('Starting interview...');
      try {
        const token = localStorage.getItem('token');
        const resp = await fetch(getApiUrl('/api/interview/start-stream'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify({
            level: 'intermediate',
            domain,
          }),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          setStatusMsg(err.message || 'Failed to start interview');
          return;
        }

        const data = await resp.json();
        if (data && data.interviewId) {
          const newId = String(data.interviewId);
          setInterviewId(newId);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('visionhire-last-interview-id', newId);
          }
        }
        if (data?.domain && DOMAIN_LOOKUP[data.domain]) {
          setDomain(data.domain);
        }

        setQuestion(data?.question || 'No question generated.');
        const asked = Number(data?.questionsAsked ?? 1);
        setQuestionsAsked(asked);
        setProgress(Math.round((asked / MAX_QUESTIONS) * 100));
        setStatusMsg('');
        setTime(60); // Start countdown timer
      } catch (err) {
        console.error(err);
        setStatusMsg('Network error starting interview');
      }
    }

    startInterview();
  }, [domain]);

  // 🧠 Submit answer + get next question
  const handleNext = async () => {
    if (!interviewId) return alert('Interview not started');
    if (recognitionRef.current) recognitionRef.current.stop();
    
    // Clear timer when manually moving to next question
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setStatusMsg('Submitting answer...');
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const resp = await fetch(getApiUrl('/api/interview/sendAnswer-stream'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ interviewId, answer }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        setStatusMsg(err.message || 'Failed to submit answer');
        return;
      }

      const data = await resp.json();
      const finished = Boolean(data?.finished);

      // ✅ Navigate to results if interview ends
      if (finished || data?.message === 'Interview finished' || questionsAsked + 1 >= MAX_QUESTIONS) {
        // Clear timer when interview ends
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        navigate('/result', {
          state: {
            message: finished ? 'Interview finished' : data?.message || 'Interview finished',
            interviewId,
            domain: data?.domain || domain,
            domainLabel: data?.domainLabel || DOMAIN_LOOKUP[data?.domain] || DOMAIN_LOOKUP[domain],
          },
        });
        return;
      }

      // Continue to next question
      setQuestion(data?.question || 'Could not generate the next question.');
      const asked = Number(data?.questionsAsked ?? questionsAsked + 1);
      setQuestionsAsked(asked);
      setProgress(Math.round((asked / MAX_QUESTIONS) * 100));
      setAnswer('');
      // Clear timer before resetting to ensure clean restart
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTime(60); // Reset timer for next question - this will trigger the useEffect to restart
      setStatusMsg('');
      if (data?.domain && DOMAIN_LOOKUP[data.domain]) {
        setDomain(data.domain);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg('Network error submitting answer');
    } finally {
      setTimeout(() => setIsSubmitting(false), 1200);
    }
  };

  // 🟥 End Interview Early
  const handleEnd = () => {
      if (isSubmitting) return;
      if (window.confirm('Are you sure you want to end the interview early?')) {
        if (recognitionRef.current) recognitionRef.current.stop();
        // Clear timer when ending interview early
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        navigate('/result', {
          state: {
            message: 'Interview ended early',
            interviewId,
            domain,
            domainLabel,
          },
        });
      }
  };

  // 🧭 Anti-cheating measures
  useEffect(() => {
    const disableAction = (e) => e.preventDefault();
    document.addEventListener('copy', disableAction);
    document.addEventListener('paste', disableAction);
    document.addEventListener('cut', disableAction);
    document.addEventListener('contextmenu', disableAction);

    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && ['c', 'v', 'x', 'u'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i')
      ) {
        e.preventDefault();
        setWarning('⚠️ Copy-paste is disabled!');
        setTimeout(() => setWarning(''), 3000);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !warningShown) {
        setWarningShown(true);
        alert('⚠️ You switched tabs! Next time the interview will terminate.');
      } else if (document.hidden && warningShown) {
        alert('Interview ended due to multiple tab switches.');
        navigate('/result', {
          state: {
            message: 'Terminated due to cheating',
            interviewId,
            domain,
            domainLabel,
          },
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('copy', disableAction);
      document.removeEventListener('paste', disableAction);
      document.removeEventListener('cut', disableAction);
      document.removeEventListener('contextmenu', disableAction);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate, warningShown, interviewId]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds /60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className={`page-shell interview-start-page ${darkMode ? 'dark' : ''}`}>
      <div className="page-glow one" />
      <div className="page-glow two" />
      <div className="page-content">
        <header className="interview-header glass-surface">
          <div className="header-top">
            <span className="tag-pill">Live session · {domainLabel}</span>
            <h1>
              VisionHire <span>Interview Room</span>
            </h1>
            <p>
              Answer each question like it’s the real interview. VisionHire analyses your responses and
              tunes the next challenge instantly.
            </p>
          </div>

          <div className="status-bar">
            <div className="status-chip">
              <span>Question</span>
              <strong>
                {questionsAsked}/{MAX_QUESTIONS}
              </strong>
            </div>
            <div className="status-chip">
              <span>Timer</span>
              <strong>{formatTime(time)}</strong>
            </div>
            <div className="status-chip">
              <span>Status</span>
              <strong>{statusMsg || 'Ready'}</strong>
            </div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
            <span>{progress}% complete</span>
          </div>
        </header>

        {warning && <div className="warning-banner">{warning}</div>}

        <section className="question-section glass-surface">
          <div className="question-card">
            <span className="question-pill">Current question</span>
            <p>{question || 'Loading question...'}</p>
          </div>

          <div className="answer-section">
            <label htmlFor="answer-input">Your answer</label>
            <textarea
              id="answer-input"
              value={answer}
              onChange={(e) => {
                const newValue = e.target.value;
                setAnswer(newValue);
              }}
              placeholder="Speak or type your response..."
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              style={{ userSelect: 'none' }}
            />
            <div className="answer-actions">
              <button
                className={`voice-button ${listening ? 'listening' : ''}`}
                onClick={handleVoiceToggle}
                disabled={isSubmitting}
              >
                {listening ? '🛑 Stop Listening' : '🎙 Start Voice Answer'}
              </button>
              <button
                className="cta-button primary"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next question →
              </button>
            </div>
            <p className="answer-hint">
              Tip: Speak clearly and cover your reasoning—VisionHire scores both accuracy and depth.
            </p>
          </div>
        </section>

        <footer className="interview-footer">
          <button className="cta-button ghost" onClick={handleEnd} disabled={isSubmitting}>
            End interview early
          </button>
        </footer>
      </div>
    </div>
  );
}

export default InterviewStart;
