import MistakePattern from '../models/MistakePattern.js';
import Question from '../models/Question.js';

/**
 * Record a mistake or correct answer for concept tracking
 * Automatically updates spaced repetition schedule and mastery level
 */
export const recordConceptAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionId, questionText, topic, difficulty, isCorrect, userAnswer, expectedAnswer } = req.body;

    if (!questionText || !topic || typeof isCorrect !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: questionText, topic, isCorrect'
      });
    }

    // Generate concept fingerprint
    const conceptFingerprint = MistakePattern.generateFingerprint(questionText, topic);

    console.log(`📝 Recording ${isCorrect ? 'correct' : 'mistake'} attempt for concept: ${conceptFingerprint}`);

    // Find or create mistake pattern
    let pattern = await MistakePattern.findOne({ userId, conceptFingerprint });

    if (!pattern) {
      pattern = new MistakePattern({
        userId,
        conceptFingerprint,
        topic,
        difficulty: difficulty || 'Medium',
        mistakeCount: isCorrect ? 0 : 1,
        correctCount: isCorrect ? 1 : 0,
        consecutiveCorrect: isCorrect ? 1 : 0,
        lastMistakeAt: isCorrect ? null : Date.now(),
        lastCorrectAt: isCorrect ? Date.now() : null
      });
    } else {
      // Update existing pattern
      if (isCorrect) {
        pattern.correctCount += 1;
        pattern.consecutiveCorrect += 1;
        pattern.lastCorrectAt = Date.now();
      } else {
        pattern.mistakeCount += 1;
        pattern.consecutiveCorrect = 0;
        pattern.lastMistakeAt = Date.now();
        
        // Track common error patterns
        if (userAnswer && expectedAnswer) {
          const errorType = analyzeErrorType(userAnswer, expectedAnswer);
          const existingError = pattern.commonErrors.find(e => e.errorType === errorType);
          if (existingError) {
            existingError.occurrences += 1;
          } else {
            pattern.commonErrors.push({
              errorType,
              description: `Common mistake in ${topic}`,
              occurrences: 1
            });
          }
        }
      }

      // Add to related questions
      pattern.relatedQuestions.push({
        questionId: questionId || null,
        wasCorrect: isCorrect,
        attemptedAt: Date.now()
      });

      // Keep only last 10 related questions
      if (pattern.relatedQuestions.length > 10) {
        pattern.relatedQuestions = pattern.relatedQuestions.slice(-10);
      }
    }

    // Calculate spaced repetition schedule (quality: 0-5)
    const quality = isCorrect ? 4 : 1;
    pattern.calculateNextReview(quality);

    // Update mastery level and priority
    pattern.updateMasteryLevel();
    pattern.updatePriority();
    pattern.calculateImprovement();

    await pattern.save();

    console.log(`✅ Mistake pattern updated: ${pattern.masteryLevel}, priority: ${pattern.priority}, next review: ${pattern.nextReviewAt}`);

    res.status(200).json({
      success: true,
      message: 'Concept attempt recorded successfully',
      pattern: {
        conceptFingerprint: pattern.conceptFingerprint,
        topic: pattern.topic,
        masteryLevel: pattern.masteryLevel,
        isImproving: pattern.isImproving,
        improvementScore: pattern.improvementScore,
        nextReviewAt: pattern.nextReviewAt,
        consecutiveCorrect: pattern.consecutiveCorrect
      }
    });

  } catch (error) {
    console.error('Record concept attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error recording concept attempt'
    });
  }
};

/**
 * Get prioritized weak concepts for targeted practice
 * Uses spaced repetition to determine what to review next
 */
export const getWeakConcepts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10, includeImproving = true } = req.query;

    console.log(`🔍 Fetching weak concepts for user: ${userId}`);

    // Build query for concepts needing review
    const query = {
      userId,
      masteryLevel: { $in: ['Struggling', 'Learning', 'Practicing'] }
    };

    if (includeImproving === 'false') {
      query.isImproving = false;
    }

    const weakConcepts = await MistakePattern.find(query)
      .sort({
        priority: -1, // High priority first
        nextReviewAt: 1, // Due for review first
        mistakeCount: -1, // More mistakes first
        lastMistakeAt: -1 // Recent mistakes first
      })
      .limit(parseInt(limit))
      .lean();

    // Calculate statistics
    const totalConcepts = await MistakePattern.countDocuments({ userId });
    const strugglingCount = await MistakePattern.countDocuments({ 
      userId, 
      masteryLevel: 'Struggling' 
    });
    const improvingCount = await MistakePattern.countDocuments({
      userId,
      isImproving: true
    });

    console.log(`📊 Found ${weakConcepts.length} weak concepts, ${strugglingCount} struggling, ${improvingCount} improving`);

    res.status(200).json({
      success: true,
      weakConcepts,
      stats: {
        total: totalConcepts,
        weak: weakConcepts.length,
        struggling: strugglingCount,
        improving: improvingCount
      }
    });

  } catch (error) {
    console.error('Get weak concepts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching weak concepts'
    });
  }
};

/**
 * Get concepts due for review based on spaced repetition schedule
 */
export const getDueForReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 5 } = req.query;

    const dueForReview = await MistakePattern.find({
      userId,
      nextReviewAt: { $lte: new Date() },
      masteryLevel: { $ne: 'Mastered' }
    })
      .sort({ priority: -1, nextReviewAt: 1 })
      .limit(parseInt(limit))
      .lean();

    console.log(`⏰ ${dueForReview.length} concepts due for review`);

    res.status(200).json({
      success: true,
      dueForReview,
      count: dueForReview.length
    });

  } catch (error) {
    console.error('Get due for review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching concepts due for review'
    });
  }
};

/**
 * Get improvement trends over time
 */
export const getImprovementTrends = async (req, res) => {
  try {
    const userId = req.user._id;

    const patterns = await MistakePattern.find({ userId })
      .select('topic masteryLevel improvementScore isImproving mistakeCount correctCount consecutiveCorrect')
      .lean();

    // Group by mastery level
    const masteryDistribution = patterns.reduce((acc, p) => {
      acc[p.masteryLevel] = (acc[p.masteryLevel] || 0) + 1;
      return acc;
    }, {});

    // Calculate overall improvement
    const improvingPatterns = patterns.filter(p => p.isImproving);
    const avgImprovement = patterns.length > 0
      ? patterns.reduce((sum, p) => sum + p.improvementScore, 0) / patterns.length
      : 0;

    // Top improving topics
    const topImproving = patterns
      .filter(p => p.isImproving && p.improvementScore > 50)
      .sort((a, b) => b.improvementScore - a.improvementScore)
      .slice(0, 5)
      .map(p => ({
        topic: p.topic,
        improvementScore: p.improvementScore,
        masteryLevel: p.masteryLevel
      }));

    res.status(200).json({
      success: true,
      trends: {
        masteryDistribution,
        improvingCount: improvingPatterns.length,
        averageImprovement: Math.round(avgImprovement),
        topImproving,
        totalPatterns: patterns.length
      }
    });

  } catch (error) {
    console.error('Get improvement trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching improvement trends'
    });
  }
};

/**
 * Check if a question concept was previously struggled with
 */
export const checkPreviousStruggle = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionText, topic } = req.query;

    if (!questionText || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Missing questionText or topic'
      });
    }

    const conceptFingerprint = MistakePattern.generateFingerprint(questionText, topic);
    const pattern = await MistakePattern.findOne({ userId, conceptFingerprint }).lean();

    if (!pattern) {
      return res.status(200).json({
        success: true,
        previouslyStruggled: false
      });
    }

    res.status(200).json({
      success: true,
      previouslyStruggled: true,
      pattern: {
        masteryLevel: pattern.masteryLevel,
        mistakeCount: pattern.mistakeCount,
        correctCount: pattern.correctCount,
        isImproving: pattern.isImproving,
        improvementScore: pattern.improvementScore,
        lastMistakeAt: pattern.lastMistakeAt
      }
    });

  } catch (error) {
    console.error('Check previous struggle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking previous struggle'
    });
  }
};

// Helper function to analyze error type
function analyzeErrorType(userAnswer, expectedAnswer) {
  const userLower = userAnswer.toLowerCase();
  const expectedLower = expectedAnswer.toLowerCase();

  // Check for common error patterns
  if (userLower.length < expectedLower.length * 0.5) {
    return 'incomplete-answer';
  }
  if (!userLower.includes('because') && !userLower.includes('why') && expectedLower.includes('because')) {
    return 'missing-explanation';
  }
  if (userLower.split(' ').length < 20) {
    return 'too-brief';
  }
  if (!userLower.match(/\b(example|such as|for instance)\b/) && expectedLower.match(/\b(example|such as|for instance)\b/)) {
    return 'missing-examples';
  }
  
  return 'conceptual-gap';
}
