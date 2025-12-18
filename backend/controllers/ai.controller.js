import { generateInterviewQuestions, generateConceptExplanation } from '../utils/gemini.js';
import Question from '../models/Question.js';

// @desc    Generate interview questions
// @route   POST /api/ai/generate-questions
export const generateQuestions = async (req, res) => {
  try {
    const { role, experience, focusAreas } = req.body;

    // Validation
    if (!role || !experience) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide role and experience' 
      });
    }

    // Generate questions using Gemini AI
    const questions = await generateInterviewQuestions(role, experience, focusAreas);

    res.status(200).json({
      success: true,
      message: 'Questions generated successfully',
      questions
    });
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error generating questions' 
    });
  }
};

// @desc    Generate concept explanation for a question
// @route   POST /api/ai/explain-concept/:questionId
export const explainConcept = async (req, res) => {
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

    // Generate explanation using Gemini AI
    const explanation = await generateConceptExplanation(
      question.question, 
      question.answer
    );

    // Update question with explanation
    question.conceptExplanation = explanation;
    await question.save();

    res.status(200).json({
      success: true,
      message: 'Concept explanation generated successfully',
      explanation,
      question
    });
  } catch (error) {
    console.error('Explain concept error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error generating explanation' 
    });
  }
};
