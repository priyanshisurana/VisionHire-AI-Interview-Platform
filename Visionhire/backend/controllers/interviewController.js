import Interview from "../models/Interview.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// =============== CONFIGURATION ===============
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || "").trim();
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const INITIAL_QUESTION = "Tell me about yourself.";
const MAX_QUESTIONS = 15;
const PER_QUESTION_MAX_SCORE = 5;
const GEMINI_CALL_DELAY_MS = 1500;

const AVAILABLE_DOMAINS = [
  { value: "full stack web development", label: "Full Stack Web Development" },
  { value: "data structures", label: "Data Structures" },
  { value: "computer networks", label: "Computer Networks" },
  { value: "operating systems", label: "Operating Systems" },
  { value: "database management systems", label: "Database Management Systems" },
  { value: "object oriented programming", label: "Object Oriented Programming" },
];

const DEFAULT_DOMAIN = AVAILABLE_DOMAINS[0];
const DOMAIN_LOOKUP = new Map(AVAILABLE_DOMAINS.map((domain) => [domain.value, domain]));
const DOMAIN_ALIASES = {
  "full stack development": "full stack web development",
  "fullstack development": "full stack web development",
  "fullstack web development": "full stack web development",
  "dbms": "database management systems",
  "database management system": "database management systems",
  "oop": "object oriented programming",
  "o.o.p": "object oriented programming",
  "operating system": "operating systems",
  "os": "operating systems",
  "cn": "computer networks",
  "networks": "computer networks",
  "ds": "data structures",
};

let geminiModel = null;
let lastGeminiCallTimestamp = 0;
if (GEMINI_API_KEY) {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    console.log("✅ Gemini model initialized:", GEMINI_MODEL);
  } catch (err) {
    console.error("❌ Error initializing Gemini:", err);
  }
} else {
  console.warn("⚠️ GEMINI_API_KEY missing — using fallback questions only.");
}

// =============== HELPER FUNCTIONS ===============
function resolveDomain(input) {
  if (!input) return DEFAULT_DOMAIN;
  const normalized = String(input).trim().toLowerCase();
  const aliased = DOMAIN_ALIASES[normalized];
  if (aliased && DOMAIN_LOOKUP.get(aliased)) {
    return DOMAIN_LOOKUP.get(aliased);
  }
  return DOMAIN_LOOKUP.get(normalized) || DEFAULT_DOMAIN;
}

async function waitForGeminiWindow() {
  if (!geminiModel) return;
  const now = Date.now();
  const elapsed = now - lastGeminiCallTimestamp;
  if (elapsed < GEMINI_CALL_DELAY_MS) {
    await new Promise((resolve) => setTimeout(resolve, GEMINI_CALL_DELAY_MS - elapsed));
  }
}

async function generateGeminiContent(prompt) {
  if (!geminiModel) return null;
  await waitForGeminiWindow();
  try {
    const result = await geminiModel.generateContent(prompt);
    lastGeminiCallTimestamp = Date.now();
    return result;
  } catch (err) {
    lastGeminiCallTimestamp = Date.now();
    throw err;
  }
}

function extractQuestion(text = "") {
  if (!text) return "";
  const cleaned = text.replace(/\*\*/g, "").replace(/^["']|["']$/g, "").trim();
  const match = cleaned.match(/[^.?!]*\?+/);
  return match ? match[0].trim() : cleaned.split("\n")[0].trim();
}

async function callGemini(prompt, retries = 3) {
  if (!geminiModel) return null;
  for (let i = 0; i < retries; i++) {
    try {
      const result = await generateGeminiContent(prompt);
      const text = await result.response.text();
      if (text) return text.trim();
    } catch (err) {
      if (err.status === 429 || err.code === 429) {
        const wait = (i + 1) * 2000;
        console.warn(`429: waiting ${wait / 1000}s before retry (${i + 1}/${retries})`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      console.error("Gemini API error:", err.message);
      break;
    }
  }
  return null;
}

async function analyzeAnswer(answer, question) {
  if (!geminiModel) return { keywords: [], score: 0 };

  const analysisPrompt = `
You are an AI interviewer evaluator.
Analyze the following answer for important keywords, correctness, and depth.

Question: "${question}"
Answer: "${answer}"

Output strictly in JSON:
{
  "keywords": ["list", "of", "main", "concepts"],
  "score": <number from 0 to 5 inclusive, where 5 is excellent and 0 is incorrect/absent>,
  "reason": "one short sentence explaining the score in plain language",
  "followup": "one short follow-up question related to the same topic"
}`;

  try {
    const result = await generateGeminiContent(analysisPrompt);
    const text = await result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { keywords: [], score: 0 };

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Error analyzing answer:", err.message);
    return { keywords: [], score: 0 };
  }
}

// =============== MAIN CONTROLLER ===============
const interviewController = {
  // 🟢 START INTERVIEW
  async startInterviewStream(req, res) {
    try {
      const userId = req.user?.userId || req.body?.userId;
      if (!userId) return res.status(400).json({ message: "User ID required." });

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      const level = "easy";
      const domainEntry = resolveDomain(req.body?.domain);
      const domainLabel = domainEntry.label;

      const prompt = `You are a concise interviewer specialized in ${domainLabel}.
Ask ONE single-sentence ${level} level technical interview question.
Output only the question, nothing else.`;

      let modelText = await callGemini(prompt);
      const firstQuestion = extractQuestion(modelText) || INITIAL_QUESTION;

      // ✅ Create a new interview
      const interview = new Interview({
        user: userId,
        questionsAsked: 0,
        score: 0,
        followUpCount: 0,
        history: [{ question: firstQuestion, answer: "", score: 0, maxScore: PER_QUESTION_MAX_SCORE, scoreReason: "" }],
        date: new Date(),
        metadata: {
          level,
          domain: domainEntry.value,
          domainLabel,
          maxQuestions: MAX_QUESTIONS,
        },
      });

      await interview.save();

      console.log("🟢 Interview started for user:", userId);

      res.status(200).json({
        interviewId: interview._id,
        question: firstQuestion,
        questionsAsked: 1, // for UI display only
        finished: false,
        domain: domainEntry.value,
        domainLabel,
      });
    } catch (err) {
      console.error("startInterviewStream error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  // 🟡 SEND ANSWER
  async sendAnswerStream(req, res) {
    try {
      const { interviewId, answer } = req.body;
      if (!interviewId) return res.status(400).json({ message: "Interview ID required." });

      const interview = await Interview.findById(interviewId);
      if (!interview) return res.status(404).json({ message: "Interview not found." });

      const lastIdx = interview.history.length - 1;
      const updatedAnswer = String(answer || "").trim();
      const lastQuestion = interview.history[lastIdx].question;

      // 🧠 Analyze answer
      const analysis = await analyzeAnswer(updatedAnswer, lastQuestion);
      const { keywords, score, followup, reason } = analysis;
      const normalizedScore = Math.min(
        Math.max(Number.isFinite(Number(score)) ? Number(score) : 0, 0),
        PER_QUESTION_MAX_SCORE
      );
      const scoreReason =
        typeof reason === "string" && reason.trim().length > 0
          ? reason.trim()
          : normalizedScore >= PER_QUESTION_MAX_SCORE * 0.8
            ? "Answer covered the key expectations."
            : normalizedScore >= PER_QUESTION_MAX_SCORE * 0.4
              ? "Answer addressed parts of the question but missed depth."
              : "Answer lacked required detail or accuracy.";

      // ✅ Update current history entry
      const previousScore = Number(interview.history[lastIdx].score || 0);
      interview.history[lastIdx].answer = updatedAnswer;
      interview.history[lastIdx].score = normalizedScore;
      interview.history[lastIdx].maxScore = PER_QUESTION_MAX_SCORE;
      interview.history[lastIdx].scoreReason = scoreReason;
      interview.history[lastIdx].keywords = keywords;

      interview.score = Math.max(0, (interview.score || 0) - previousScore + normalizedScore);
      interview.score = Math.min(interview.score, MAX_QUESTIONS * PER_QUESTION_MAX_SCORE);
      interview.questionsAsked += 1;

      const followUpCount = interview.followUpCount || 0;
      let nextQuestion = "";
      const metaDomain = interview.metadata?.domain;
      const domainEntry = resolveDomain(metaDomain);
      const domainLabel = interview.metadata?.domainLabel || domainEntry.label;
      interview.metadata = interview.metadata || {};
      interview.metadata.domain = domainEntry.value;
      interview.metadata.domainLabel = domainLabel;
      interview.markModified?.("metadata");

      const reasoning = keywords.length
        ? `You mentioned ${keywords.slice(0, 2).join(", ")}, so let me ask — `
        : "";

      const isFinished = interview.questionsAsked >= MAX_QUESTIONS;

      if (!isFinished) {
        // ✅ Choose next question
        if (followUpCount < 3 && followup) {
          nextQuestion = `${reasoning}${followup}`;
          interview.followUpCount += 1;
        } else {
          const excludedTopics = keywords.join(", ") || "previous topics";
          const newPrompt = `Ask a new technical interview question in ${domainLabel} that is not related to ${excludedTopics}. Keep it single sentence and concise.`;
          const modelText = await callGemini(newPrompt);
          nextQuestion = extractQuestion(modelText) || INITIAL_QUESTION;
          interview.followUpCount = 0;
        }

        // ✅ Push new question
        interview.history.push({
          question: nextQuestion,
          answer: "",
          score: 0,
          maxScore: PER_QUESTION_MAX_SCORE,
          scoreReason: ""
        });
      } else {
        interview.followUpCount = 0;
      }

      // ✅ Save everything in one go
      await interview.save();

      console.log("✅ Interview updated:", interview._id);

      res.status(200).json({
        interviewId,
        keywords,
        score: normalizedScore,
        reason: scoreReason,
        maxScore: PER_QUESTION_MAX_SCORE,
        question: nextQuestion,
        questionsAsked: interview.questionsAsked,
        finished: isFinished,
        domain: domainEntry.value,
        domainLabel,
      });
    } catch (err) {
      console.error("sendAnswerStream error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  async getInterviewResult(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user?.userId;

      if (!interviewId) {
        return res.status(400).json({ message: "Interview ID is required." });
      }
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized." });
      }

      const interview = await Interview.findById(interviewId).lean();
      if (!interview) {
        return res.status(404).json({ message: "Interview not found." });
      }
      if (String(interview.user) !== String(userId)) {
        return res.status(403).json({ message: "Access denied." });
      }

      const totalPossibleScore = MAX_QUESTIONS * 5;

      res.status(200).json({
        interviewId,
        score: interview.score,
        maxScore: totalPossibleScore,
        questionsAnswered: interview.questionsAsked,
        history: interview.history || [],
        metadata: interview.metadata || {},
        date: interview.date,
      });
    } catch (err) {
      console.error("getInterviewResult error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
};

export default interviewController;
