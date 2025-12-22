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

export default genAI;
