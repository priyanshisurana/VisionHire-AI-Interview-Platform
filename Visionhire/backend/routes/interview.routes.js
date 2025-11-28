// routes/interview.routes.js
import express from 'express';
import interviewController from '../controllers/interviewController.js';

const router = express.Router();

/**
 * Simple ping route to verify server connection
 */
router.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Interview API is live 🚀' });
});

/**
 * Streaming endpoints (preferred)
 * - POST /api/interview/start-stream      => streams the initial question
 * - POST /api/interview/sendAnswer-stream => streams evaluation + next question
 */
router.post('/start-stream', interviewController.startInterviewStream);
router.post('/sendAnswer-stream', interviewController.sendAnswerStream);

/**
 * Backwards-compatible routes
 * Map the older route names to the streaming handlers so existing frontend code
 * that calls /start or /sendAnswer will continue to work.
 */
router.post('/start', interviewController.startInterviewStream);
router.post('/sendAnswer', interviewController.sendAnswerStream);
router.post('/answer', interviewController.sendAnswerStream); // alias for compatibility

/**
 * Fetch interview summary/result
 */
router.get('/:interviewId', interviewController.getInterviewResult);

export default router;
