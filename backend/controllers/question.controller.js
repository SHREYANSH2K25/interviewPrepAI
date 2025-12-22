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

// @desc    Submit answer for a question
// @route   PATCH /api/questions/:questionId/answer
export const submitAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { userAnswer } = req.body;

    // Validation
    if (!userAnswer) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an answer' 
      });
    }

    // Find question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'Question not found' 
      });
    }

    // Use AI to evaluate the answer
    const { evaluateUserAnswer } = await import('../utils/gemini.js');
    let evaluation;
    
    try {
      evaluation = await evaluateUserAnswer(
        question.question,
        question.answer,
        userAnswer
      );
    } catch (error) {
      console.error('AI evaluation failed:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to evaluate answer. Please try again.'
      });
    }

    // Update question with user answer and AI evaluation
    question.userAnswer = userAnswer;
    question.isCorrect = evaluation.isCorrect;
    await question.save();

    console.log('✅ Answer saved to database:', {
      questionId: question._id,
      userAnswer: userAnswer.substring(0, 50) + '...',
      isCorrect: question.isCorrect,
      evaluationScore: evaluation.score
    });

    // Record concept attempt in mistake tracking system
    try {
      const MistakePattern = (await import('../models/MistakePattern.js')).default;
      const conceptFingerprint = MistakePattern.generateFingerprint(question.question, question.topic || 'General');
      
      let pattern = await MistakePattern.findOne({ 
        userId: req.user._id, 
        conceptFingerprint 
      });

      if (!pattern) {
        pattern = new MistakePattern({
          userId: req.user._id,
          conceptFingerprint,
          topic: question.topic || 'General',
          difficulty: question.difficulty || 'Medium',
          mistakeCount: evaluation.isCorrect ? 0 : 1,
          correctCount: evaluation.isCorrect ? 1 : 0,
          consecutiveCorrect: evaluation.isCorrect ? 1 : 0,
          lastMistakeAt: evaluation.isCorrect ? null : Date.now(),
          lastCorrectAt: evaluation.isCorrect ? Date.now() : null
        });
      } else {
        if (evaluation.isCorrect) {
          pattern.correctCount += 1;
          pattern.consecutiveCorrect += 1;
          pattern.lastCorrectAt = Date.now();
        } else {
          pattern.mistakeCount += 1;
          pattern.consecutiveCorrect = 0;
          pattern.lastMistakeAt = Date.now();
        }

        pattern.relatedQuestions.push({
          questionId: question._id,
          wasCorrect: evaluation.isCorrect,
          attemptedAt: Date.now()
        });

        if (pattern.relatedQuestions.length > 10) {
          pattern.relatedQuestions = pattern.relatedQuestions.slice(-10);
        }
      }

      const quality = evaluation.isCorrect ? 4 : 1;
      pattern.calculateNextReview(quality);
      pattern.updateMasteryLevel();
      pattern.updatePriority();
      pattern.calculateImprovement();

      await pattern.save();
      console.log(`🧠 Mistake pattern updated: ${pattern.masteryLevel}`);
    } catch (mistakeError) {
      console.error('Error recording mistake pattern:', mistakeError);
      // Don't fail the request if mistake tracking fails
    }

    // Update session lastUpdated
    const session = await Session.findOne({ questions: questionId });
    if (session) {
      session.lastUpdated = Date.now();
      await session.save();
      console.log('🔄 Session updated:', session._id);
    }

    res.status(200).json({
      success: true,
      message: 'Answer evaluated successfully',
      question,
      evaluation
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error submitting answer' 
    });
  }
};
