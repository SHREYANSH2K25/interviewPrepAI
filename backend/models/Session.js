import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: [true, 'Job role is required'],
    trim: true
  },
  experience: {
    type: String,
    required: [true, 'Experience level is required'],
    trim: true
  },
  focusAreas: {
    type: [String],
    default: []
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
