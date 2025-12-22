import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    default: ''
  },
  isCorrect: {
    type: Boolean,
    default: null
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  },
  conceptExplanation: {
    type: String,
    default: ''
  },
  topic: {
    type: String,
    default: 'General',
    index: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

export default Question;
