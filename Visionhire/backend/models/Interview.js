import mongoose from 'mongoose';

// Each Q–A entry in the interview
const historyEntrySchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  score: { type: Number, default: 0 },
  maxScore: { type: Number, default: 5 },
  scoreReason: { type: String, default: "" },
  keywords: { type: [String], default: [] } // ← store extracted keywords
});

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionsAsked: { type: Number, default: 0 },
  score: { type: Number, default: 0 },

  // Track how many follow-up questions have been asked for the current topic
  followUpCount: { type: Number, default: 0 },

  // Store Q–A history with keywords and scores
  history: { type: [historyEntrySchema], default: [] },

  // Metadata like difficulty, domain, etc.
  metadata: {
    level: { type: String, default: "easy" },
    domain: { type: String, default: "full stack development" }
  },

  date: { type: Date, default: Date.now }
});

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
