import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateInterviewQuestions = async (role, experience, focusAreas = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const focusAreasText = focusAreas.length > 0 
      ? `Focus on these areas: ${focusAreas.join(', ')}.` 
      : '';

    const prompt = `You are an expert technical interviewer. Generate 10 high-quality technical interview questions with detailed answers for a ${role} position with ${experience} years of experience. ${focusAreasText}

Requirements:
1. Questions should be role-specific and appropriate for the experience level
2. Include a mix of conceptual, practical, and scenario-based questions
3. Provide comprehensive answers (150-300 words each)
4. Format as JSON array with this structure: [{"question": "...", "answer": "..."}]
5. Make questions challenging but fair for the experience level
6. Include code examples in answers where relevant

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
    return questions;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate interview questions');
  }
};

export const generateConceptExplanation = async (question, currentAnswer) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate concept explanation');
  }
};

export default genAI;
