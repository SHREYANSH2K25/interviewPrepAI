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
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

export default Question;
