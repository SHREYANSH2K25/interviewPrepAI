import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateInterviewQuestions = async (role, experience, focusAreas = []) => {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      throw new Error('AI service not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const focusAreasText = focusAreas.length > 0 
      ? `Focus on these areas: ${focusAreas.join(', ')}.` 
      : '';

    const prompt = `You are an expert technical interviewer. Generate 10 high-quality technical interview questions with detailed answers for a ${role} position with ${experience} years of experience. ${focusAreasText}

Requirements:
1. Questions should be role-specific and appropriate for the experience level
2. Include a mix of conceptual, practical, and scenario-based questions
3. Provide comprehensive answers (150-300 words each)
4. Assign a specific topic/category for each question (e.g., "JavaScript", "Algorithms", "System Design", "Databases", etc.)
5. Assign a difficulty level (Easy, Medium, or Hard) based on experience level
6. Format as JSON array with this structure: [{"question": "...", "answer": "...", "topic": "...", "difficulty": "..."}]
7. Make questions challenging but fair for the experience level
8. Include code examples in answers where relevant

Generate the questions now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse questions from AI response');
    }

    const questions = JSON.parse(jsonMatch[0]);
    
    // Ensure all questions have topic and difficulty fields
    return questions.map(q => ({
      question: q.question,
      answer: q.answer,
      topic: q.topic || 'General',
      difficulty: q.difficulty || 'Medium'
    }));
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate interview questions');
  }
};

export const generateConceptExplanation = async (question, currentAnswer) => {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      throw new Error('AI service not configured. Please contact administrator.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a technical expert and educator. A candidate asked this interview question:

Question: "${question}"

Current Answer: "${currentAnswer}"

Please provide a detailed concept explanation that helps the candidate understand the "why" behind this answer. Include:
1. Core concepts and fundamentals
2. Real-world use cases and examples
3. Common pitfalls and best practices
4. Related concepts they should know
5. Code examples if relevant

Keep the explanation comprehensive but easy to understand (300-500 words). Use markdown formatting for better readability.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();

    return explanation;
  } catch (error) {
    console.error('Gemini API error:', error.message);
    console.error('Full error:', error);
    
    // Provide a fallback explanation
    const fallbackExplanation = `## Understanding This Concept

This interview question tests your understanding of fundamental concepts in software development.

### Core Principles

${currentAnswer}

### Why This Matters

Understanding this concept is crucial because:
- It demonstrates your technical depth and problem-solving abilities
- It's commonly used in real-world applications
- Interviewers use it to assess your practical experience

### Key Points to Remember

- Break down complex problems into manageable parts
- Consider performance implications and trade-offs
- Stay updated with industry best practices
- Practice explaining technical concepts clearly

### Interview Tips

When answering similar questions:
1. Start with a clear, concise definition
2. Provide concrete examples from your experience
3. Discuss pros/cons or alternative approaches
4. Show awareness of real-world applications

*Note: This is a generated fallback explanation. For AI-powered detailed explanations, please ensure the AI service is properly configured.*`;

    return fallbackExplanation;
  }
};

export const evaluateUserAnswer = async (question, expectedAnswer, userAnswer) => {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('AI service not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an experienced technical interviewer. Evaluate the candidate's answer to this interview question.

Question: "${question}"

Expected/Model Answer: "${expectedAnswer}"

Candidate's Answer: "${userAnswer}"

Please evaluate the candidate's answer and respond in this EXACT JSON format (no markdown, no code blocks):
{
  "isCorrect": true or false,
  "score": number between 0-100,
  "feedback": "detailed feedback explaining what was good and what could be improved",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "keyPointsCovered": ["point 1", "point 2"],
  "keyPointsMissed": ["point 1", "point 2"]
}

Evaluation criteria:
- Correctness: Does the answer demonstrate understanding of core concepts?
- Completeness: Are all key points covered?
- Clarity: Is the explanation clear and well-structured?
- Accuracy: Are there any technical errors?

Be fair but thorough. A score of 70+ indicates a passing answer. Return ONLY the JSON, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Remove markdown code block formatting if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse evaluation from AI response');
    }

    const evaluation = JSON.parse(jsonMatch[0]);
    
    // Ensure all required fields are present
    if (!evaluation.hasOwnProperty('isCorrect') || !evaluation.hasOwnProperty('score')) {
      throw new Error('Invalid evaluation format');
    }

    return evaluation;
  } catch (error) {
    console.error('Gemini evaluation error:', error);
    
    // Fallback to basic keyword matching
    const userLower = userAnswer.toLowerCase();
    const expectedLower = expectedAnswer.toLowerCase();
    
    // Extract key technical terms from expected answer
    const technicalTerms = expectedLower.match(/\b[a-z]{4,}\b/g) || [];
    const matchedTerms = technicalTerms.filter(term => userLower.includes(term));
    const matchPercentage = technicalTerms.length > 0 
      ? (matchedTerms.length / technicalTerms.length) * 100 
      : 0;
    
    const isCorrect = matchPercentage >= 50;
    const score = Math.min(Math.round(matchPercentage), 100);

    return {
      isCorrect,
      score,
      feedback: isCorrect 
        ? `Your answer covers the main concepts. You mentioned ${matchedTerms.length} out of ${technicalTerms.length} key technical terms. Consider elaborating more on the details.`
        : `Your answer needs improvement. You only covered ${matchedTerms.length} out of ${technicalTerms.length} key concepts. Review the expected answer and try to include more specific technical details.`,
      strengths: isCorrect ? ['Covered main concepts', 'Shows basic understanding'] : ['Attempted the question'],
      improvements: ['Add more technical depth', 'Include specific examples', 'Explain implementation details'],
      keyPointsCovered: matchedTerms.slice(0, 3),
      keyPointsMissed: technicalTerms.filter(t => !matchedTerms.includes(t)).slice(0, 3),
      note: 'AI evaluation unavailable - using basic keyword matching'
    };
  }
};

export default genAI;
