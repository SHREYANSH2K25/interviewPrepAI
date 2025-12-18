import Question from '../models/Question.js';
import Session from '../models/Session.js';

// @desc    Add question to session
// @route   POST /api/questions/:sessionId
export const addQuestionToSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { question, answer } = req.body;

    // Validation
    if (!question || !answer) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide question and answer' 
      });
    }

    // Find session
    const session = await Session.findById(sessionId);
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
        message: 'Not authorized to modify this session' 
      });
    }

    // Create question
    const newQuestion = await Question.create({
      question,
      answer,
      isPinned: false
    });

    // Add question to session
    session.questions.push(newQuestion._id);
    session.lastUpdated = Date.now();
    await session.save();

    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      question: newQuestion
    });
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error adding question' 
    });
  }
};

// @desc    Pin/Unpin a question
// @route   PATCH /api/questions/:questionId/pin
export const togglePinQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    // Find question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'Question not found' 
      });
    }

    // Toggle pin status
    question.isPinned = !question.isPinned;
    await question.save();

    // Find session containing this question to update lastUpdated
    const session = await Session.findOne({ questions: questionId });
    if (session) {
      session.lastUpdated = Date.now();
      await session.save();
    }

    res.status(200).json({
      success: true,
      message: `Question ${question.isPinned ? 'pinned' : 'unpinned'} successfully`,
      question
    });
  } catch (error) {
    console.error('Pin question error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error pinning question' 
    });
  }
};

// @desc    Update question notes
// @route   PATCH /api/questions/:questionId/notes
export const updateQuestionNotes = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { notes } = req.body;

    // Find question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'Question not found' 
      });
    }

    // Update notes
    question.notes = notes || '';
    await question.save();

    res.status(200).json({
      success: true,
      message: 'Notes updated successfully',
      question
    });
  } catch (error) {
    console.error('Update notes error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating notes' 
    });
  }
};
