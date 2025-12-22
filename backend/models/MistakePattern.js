import mongoose from 'mongoose';

/**
 * Mistake Pattern Schema
 * Tracks conceptual mistakes using fingerprints for spaced repetition learning
 */
const mistakePatternSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  conceptFingerprint: {
    type: String,
    required: true,
    index: true,
    // Normalized concept identifier (e.g., "javascript-closures", "algorithms-binary-search")
  },
  topic: {
    type: String,
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  mistakeCount: {
    type: Number,
    default: 1,
    min: 0
  },
  correctCount: {
    type: Number,
    default: 0,
    min: 0
  },
  consecutiveCorrect: {
    type: Number,
    default: 0,
    min: 0
  },
  lastMistakeAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastCorrectAt: {
    type: Date,
    default: null
  },
  // Spaced repetition scheduling
  nextReviewAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  reviewInterval: {
    // In days: starts at 1, doubles with each correct answer
    type: Number,
    default: 1,
    min: 1
  },
  easeFactor: {
    // SM-2 algorithm ease factor (1.3 - 2.5)
    type: Number,
    default: 2.5,
    min: 1.3,
    max: 2.5
  },
  // Conceptual details
  relatedQuestions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    wasCorrect: Boolean,
    attemptedAt: Date
  }],
  commonErrors: [{
    errorType: String,
    description: String,
    occurrences: Number
  }],
  // Improvement tracking
  improvementScore: {
    // 0-100: based on recent performance trend
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isImproving: {
    type: Boolean,
    default: false
  },
  // Priority for reintroduction
  priority: {
    // High/Medium/Low based on recency, frequency, and importance
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
    index: true
  },
  // Mastery status
  masteryLevel: {
    type: String,
    enum: ['Struggling', 'Learning', 'Practicing', 'Proficient', 'Mastered'],
    default: 'Struggling'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index for efficient queries
mistakePatternSchema.index({ userId: 1, conceptFingerprint: 1 }, { unique: true });
mistakePatternSchema.index({ userId: 1, priority: 1, nextReviewAt: 1 });
mistakePatternSchema.index({ userId: 1, masteryLevel: 1 });

// Static method to generate concept fingerprint from question text
mistakePatternSchema.statics.generateFingerprint = function(questionText, topic) {
  // Extract key concepts and normalize
  const normalized = questionText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 5)
    .sort()
    .join('-');
  
  const topicNormalized = topic.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${topicNormalized}-${normalized}`.substring(0, 100);
};

// Method to calculate next review date using spaced repetition (SM-2 algorithm)
mistakePatternSchema.methods.calculateNextReview = function(quality) {
  // quality: 0 (wrong) to 5 (perfect)
  const q = Math.max(0, Math.min(5, quality));
  
  if (q < 3) {
    // Mistake: reset interval
    this.reviewInterval = 1;
    this.consecutiveCorrect = 0;
  } else {
    // Correct answer
    this.consecutiveCorrect += 1;
    
    if (this.consecutiveCorrect === 1) {
      this.reviewInterval = 1;
    } else if (this.consecutiveCorrect === 2) {
      this.reviewInterval = 6;
    } else {
      this.reviewInterval = Math.round(this.reviewInterval * this.easeFactor);
    }
    
    // Update ease factor
    this.easeFactor = Math.max(1.3, this.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  }
  
  // Set next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + this.reviewInterval);
  this.nextReviewAt = nextReview;
  
  return this.nextReviewAt;
};

// Method to update mastery level based on performance
mistakePatternSchema.methods.updateMasteryLevel = function() {
  const totalAttempts = this.mistakeCount + this.correctCount;
  const accuracyRate = totalAttempts > 0 ? this.correctCount / totalAttempts : 0;
  
  if (this.consecutiveCorrect >= 5 && accuracyRate >= 0.9) {
    this.masteryLevel = 'Mastered';
  } else if (this.consecutiveCorrect >= 3 && accuracyRate >= 0.75) {
    this.masteryLevel = 'Proficient';
  } else if (accuracyRate >= 0.6) {
    this.masteryLevel = 'Practicing';
  } else if (this.correctCount > 0) {
    this.masteryLevel = 'Learning';
  } else {
    this.masteryLevel = 'Struggling';
  }
  
  return this.masteryLevel;
};

// Method to calculate priority for review
mistakePatternSchema.methods.updatePriority = function() {
  const daysSinceLastMistake = (Date.now() - this.lastMistakeAt) / (1000 * 60 * 60 * 24);
  const isDue = this.nextReviewAt <= Date.now();
  
  // High priority: recent mistakes, due for review, struggling
  if ((daysSinceLastMistake < 7 && this.mistakeCount > 2) || 
      (isDue && this.masteryLevel === 'Struggling') ||
      (this.mistakeCount > 5 && this.consecutiveCorrect === 0)) {
    this.priority = 'High';
  }
  // Medium priority: moderate mistakes, learning phase
  else if ((daysSinceLastMistake < 14 && this.mistakeCount > 0) ||
           (isDue && ['Learning', 'Practicing'].includes(this.masteryLevel))) {
    this.priority = 'Medium';
  }
  // Low priority: old mistakes, proficient/mastered
  else {
    this.priority = 'Low';
  }
  
  return this.priority;
};

// Method to calculate improvement score
mistakePatternSchema.methods.calculateImprovement = function() {
  const recentAttempts = this.relatedQuestions.slice(-5);
  if (recentAttempts.length < 2) {
    this.improvementScore = 0;
    this.isImproving = false;
    return 0;
  }
  
  const firstHalfCorrect = recentAttempts.slice(0, Math.floor(recentAttempts.length / 2))
    .filter(q => q.wasCorrect).length;
  const secondHalfCorrect = recentAttempts.slice(Math.floor(recentAttempts.length / 2))
    .filter(q => q.wasCorrect).length;
  
  const firstHalfRate = firstHalfCorrect / Math.floor(recentAttempts.length / 2);
  const secondHalfRate = secondHalfCorrect / Math.ceil(recentAttempts.length / 2);
  
  const improvement = (secondHalfRate - firstHalfRate) * 100;
  this.improvementScore = Math.max(0, Math.min(100, Math.round(improvement + 50)));
  this.isImproving = improvement > 0.1;
  
  return this.improvementScore;
};

const MistakePattern = mongoose.model('MistakePattern', mistakePatternSchema);

export default MistakePattern;
