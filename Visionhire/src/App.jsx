import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Interview from './pages/Interview';
import Guidelines from './pages/Guidelines';
import Setup from './pages/Setup';
import InterviewStart from './pages/InterviewStart';
import Result from './pages/Result';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/guidelines" element={<Guidelines />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/interview-start" element={<InterviewStart />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}

export default App;
