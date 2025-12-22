import Session from '../models/Session.js';
import Question from '../models/Question.js';
import { generateInterviewQuestions } from '../utils/gemini.js';

// Sample questions fallback when AI is unavailable
const getSampleQuestions = (role, experience) => [
  {
    question: `What are the key responsibilities of a ${role}?`,
    answer: `A ${role} with ${experience} years of experience typically handles core technical implementations, code reviews, mentoring junior developers, and contributing to architectural decisions.`
  },
  {
    question: "Describe your experience with version control systems.",
    answer: "Experience with Git, branching strategies, pull requests, code reviews, and collaboration workflows in team environments."
  },
  {
    question: "How do you approach problem-solving in your projects?",
    answer: "Breaking down complex problems, analyzing requirements, considering multiple solutions, evaluating trade-offs, and implementing the most effective approach."
  },
  {
    question: "What development methodologies are you familiar with?",
    answer: "Agile, Scrum, Kanban methodologies with experience in sprint planning, daily standups, retrospectives, and continuous delivery practices."
  },
  {
    question: "How do you ensure code quality in your projects?",
    answer: "Through unit testing, code reviews, following coding standards, using linters, automated testing, and continuous integration practices."
  }
];

// @desc    Create a new interview session
// @route   POST /api/sessions
export const createSession = async (req, res) => {
  try {
    const { role, experience, focusAreas } = req.body;

    // Validation
    if (!role || !experience) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide role and experience' 
      });
    }

    // Try to generate questions using AI, fallback to sample questions
    let aiQuestions;
    try {
      aiQuestions = await generateInterviewQuestions(role, experience, focusAreas);
    } catch (aiError) {
      console.warn('AI generation failed, using sample questions:', aiError.message);
      aiQuestions = getSampleQuestions(role, experience);
    }

    // Create questions in database
    const questionIds = [];
    for (const q of aiQuestions) {
      const question = await Question.create({
        question: q.question,
        answer: q.answer,
        topic: q.topic || 'General',
        difficulty: q.difficulty || 'Medium',
        isPinned: false
      });
      questionIds.push(question._id);
    }

    // Create session
    const session = await Session.create({
      userId: req.user._id,
      role,
      experience,
      focusAreas: focusAreas || [],
      questions: questionIds
    });

    // Populate questions
    const populatedSession = await Session.findById(session._id).populate('questions');

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      session: populatedSession
    });
  } catch (error) {
    console.error('Create session error:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating session. Please try again.' 
    });
  }
};

// @desc    Get all sessions for logged-in user
// @route   GET /api/sessions
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id })
      .populate('questions')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    console.error('Get all sessions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching sessions' 
    });
  }
};

// @desc    Get session by ID
// @route   GET /api/sessions/:id
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('questions');

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    // Check if session belongs to user
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access this session' 
      });
    }

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching session' 
    });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    // Check if session belongs to user
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this session' 
      });
    }

    // Delete all questions associated with session
    await Question.deleteMany({ _id: { $in: session.questions } });

    // Delete session
    await Session.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error deleting session' 
    });
  }
};
