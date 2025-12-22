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
    console.log('Explain concept requested for question ID:', questionId);

    // Validate ObjectId format
    if (!questionId || questionId.length !== 24) {
      console.error('Invalid question ID format:', questionId);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid question ID format' 
      });
    }

    // Find question
    const question = await Question.findById(questionId);
    if (!question) {
      console.error('Question not found:', questionId);
      return res.status(404).json({ 
        success: false, 
        message: 'Question not found in database' 
      });
    }

    console.log('Question found, generating explanation...');

    // Generate explanation using Gemini AI (with fallback)
    let explanation;
    try {
      explanation = await generateConceptExplanation(
        question.question, 
        question.answer
      );
      console.log('Explanation generated successfully');
    } catch (aiError) {
      console.error('AI generation failed:', aiError.message);
      // Use fallback explanation
      explanation = `## Concept Explanation\n\n${question.answer}\n\n### Additional Context\n\nThis concept is fundamental to understanding the role's responsibilities. Consider how this applies to real-world scenarios and be prepared to discuss practical examples from your experience.\n\n*Note: AI explanation service is currently unavailable. This is a basic fallback explanation.*`;
      console.log('Using fallback explanation');
    }

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
      message: error.message || 'Server error generating explanation',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Evaluate user answer using AI
// @route   POST /api/ai/evaluate-answer
export const evaluateAnswer = async (req, res) => {
  try {
    const { question, expectedAnswer, userAnswer } = req.body;

    // Validation
    if (!question || !expectedAnswer || !userAnswer) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide question, expected answer, and user answer' 
      });
    }

    // Use Gemini AI to evaluate the answer
    const { evaluateUserAnswer } = await import('../utils/gemini.js');
    const evaluation = await evaluateUserAnswer(question, expectedAnswer, userAnswer);

    res.status(200).json({
      success: true,
      message: 'Answer evaluated successfully',
      evaluation
    });
  } catch (error) {
    console.error('Evaluate answer error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error evaluating answer' 
    });
  }
};
