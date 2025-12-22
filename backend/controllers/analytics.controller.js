import Session from '../models/Session.js';
import User from '../models/User.js';

/**
 * Interview Readiness Score Algorithm (0-100)
 * 
 * Components:
 * 1. Accuracy Score (40 points) - Self-assessed correct answers vs total answered
 * 2. Coverage Score (25 points) - Breadth of topics/roles practiced
 * 3. Consistency Score (20 points) - Recent activity and streak maintenance
 * 4. Depth Score (15 points) - Average questions per session, pinned items
 * 
 * Formula is deterministic and extensible for future metrics
 */

export const calculateReadinessScore = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log('🔍 Calculating readiness score for user:', userId);

    // Fetch all user sessions with populated questions
    const sessions = await Session.find({ userId: userId }).populate('questions');
    
    console.log(`📊 Found ${sessions.length} sessions for user`);
    
    if (sessions.length === 0) {
      return res.status(200).json({
        success: true,
        score: 0,
        breakdown: {
          accuracy: 0,
          coverage: 0,
          consistency: 0,
          depth: 0,
        },
        insights: {
          message: 'Create your first interview session to start building your readiness score!',
          recommendations: [
            'Generate your first AI-powered question set',
            'Practice answering questions regularly',
            'Use the pin feature for important topics',
          ],
        },
      });
    }

    // 1. ACCURACY SCORE (0-40 points)
    let totalQuestions = 0;
    let answeredQuestions = 0;
    let correctAnswers = 0;
    let pinnedCount = 0;

    sessions.forEach((session) => {
      if (session.questions && session.questions.length > 0) {
        totalQuestions += session.questions.length;
        session.questions.forEach((q) => {
          if (q.userAnswer) answeredQuestions++;
          if (q.isCorrect) correctAnswers++;
          if (q.isPinned) pinnedCount++;
        });
      }
    });

    console.log('📈 Analytics Data:', {
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      pinnedCount
    });

    const accuracyRate = answeredQuestions > 0 ? correctAnswers / answeredQuestions : 0;
    const accuracyScore = Math.round(accuracyRate * 40);

    // 2. COVERAGE SCORE (0-25 points)
    const uniqueRoles = new Set(sessions.map((s) => s.role));
    const uniqueFocusAreas = new Set();
    sessions.forEach((s) => {
      if (s.focusAreas && s.focusAreas.length > 0) {
        s.focusAreas.forEach((area) => uniqueFocusAreas.add(area));
      }
    });

    // Award points for diversity: roles (up to 15) + focus areas (up to 10)
    const rolePoints = Math.min(uniqueRoles.size * 3, 15);
    const focusPoints = Math.min(uniqueFocusAreas.size * 2, 10);
    const coverageScore = rolePoints + focusPoints;

    // 3. CONSISTENCY SCORE (0-20 points)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentSessions = sessions.filter((s) => new Date(s.updatedAt) >= thirtyDaysAgo);
    const weekSessions = sessions.filter((s) => new Date(s.updatedAt) >= sevenDaysAgo);

    // Activity in last 7 days (up to 10 points)
    const weekActivityScore = Math.min(weekSessions.length * 2, 10);
    
    // Regular engagement over 30 days (up to 10 points)
    const monthActivityScore = Math.min(recentSessions.length, 10);
    
    const consistencyScore = weekActivityScore + monthActivityScore;

    // 4. DEPTH SCORE (0-15 points)
    const avgQuestionsPerSession = totalQuestions / sessions.length;
    
    // Average questions per session (up to 8 points, capped at 10+ questions)
    const avgQuestionsScore = Math.min(Math.round(avgQuestionsPerSession * 0.8), 8);
    
    // Engagement depth via pinned questions (up to 7 points)
    const pinnedScore = Math.min(Math.round(pinnedCount * 0.7), 7);
    
    const depthScore = avgQuestionsScore + pinnedScore;

    // TOTAL SCORE
    const totalScore = Math.min(
      accuracyScore + coverageScore + consistencyScore + depthScore,
      100
    );

    // Generate insights
    const insights = generateInsights({
      totalScore,
      accuracyScore,
      coverageScore,
      consistencyScore,
      depthScore,
      sessions,
      answeredQuestions,
      totalQuestions,
      weekSessions,
      uniqueRoles,
      uniqueFocusAreas,
    });

    return res.status(200).json({
      success: true,
      score: totalScore,
      breakdown: {
        accuracy: accuracyScore,
        coverage: coverageScore,
        consistency: consistencyScore,
        depth: depthScore,
      },
      stats: {
        totalSessions: sessions.length,
        totalQuestions,
        answeredQuestions,
        correctAnswers,
        accuracyRate: Math.round(accuracyRate * 100),
        uniqueRoles: uniqueRoles.size,
        uniqueFocusAreas: uniqueFocusAreas.size,
        recentSessionsCount: recentSessions.length,
        pinnedQuestions: pinnedCount,
      },
      insights,
    });
  } catch (error) {
    console.error('Error calculating readiness score:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate readiness score',
      error: error.message,
    });
  }
};

const generateInsights = (data) => {
  const { totalScore, accuracyScore, coverageScore, consistencyScore, depthScore, sessions, answeredQuestions, totalQuestions, weekSessions, uniqueRoles, uniqueFocusAreas } = data;

  let level = 'Beginner';
  let message = '';
  const recommendations = [];

  // Determine readiness level
  if (totalScore >= 80) {
    level = 'Interview Ready';
    message = '🎉 Excellent! You\'re well-prepared for technical interviews.';
  } else if (totalScore >= 60) {
    level = 'Advanced';
    message = '💪 Strong performance! A bit more practice will get you interview-ready.';
  } else if (totalScore >= 40) {
    level = 'Intermediate';
    message = '📈 Good progress! Keep practicing to boost your confidence.';
  } else if (totalScore >= 20) {
    level = 'Developing';
    message = '🌱 You\'re on the right track. Consistency is key!';
  } else {
    level = 'Getting Started';
    message = '🚀 Welcome! Start with regular practice sessions to build momentum.';
  }

  // Generate targeted recommendations
  if (accuracyScore < 25) {
    recommendations.push('Focus on understanding concepts deeply before moving to new topics');
    recommendations.push('Review AI-generated explanations for questions you missed');
  }

  if (coverageScore < 15) {
    recommendations.push('Expand your practice to cover more roles and technologies');
    recommendations.push(`You've explored ${uniqueRoles.size} role(s) - try adding more variety`);
  }

  if (consistencyScore < 12) {
    recommendations.push('Maintain a regular study schedule - consistency drives retention');
    if (weekSessions.length === 0) {
      recommendations.push('Try to practice at least 2-3 times per week');
    }
  }

  if (depthScore < 10) {
    recommendations.push('Engage more deeply - pin important questions for review');
    recommendations.push('Aim for completing full sessions rather than skimming');
  }

  if (answeredQuestions < totalQuestions * 0.5) {
    recommendations.push(`You've answered ${answeredQuestions}/${totalQuestions} questions - keep going!`);
  }

  // Always include a positive reinforcement
  if (sessions.length >= 5) {
    recommendations.push(`Great dedication with ${sessions.length} sessions completed!`);
  }

  return {
    level,
    message,
    recommendations: recommendations.slice(0, 4), // Limit to top 4
  };
};

/**
 * Knowledge Gap Heatmap - Aggregates performance by topic
 * Uses optimized MongoDB aggregation pipeline for large datasets
 * 
 * @route GET /api/analytics/knowledge-gaps
 * @returns {Object} Topic-wise strength scores and metadata
 */
export const getKnowledgeGaps = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log('🔍 Analyzing knowledge gaps for user:', userId);

    // Optimized aggregation pipeline with indexing on userId and topic
    const sessions = await Session.find({ userId: userId })
      .select('questions role focusAreas')
      .populate({
        path: 'questions',
        select: 'question topic difficulty userAnswer isCorrect isPinned'
      })
      .lean(); // Use lean() for better performance

    if (sessions.length === 0) {
      return res.status(200).json({
        success: true,
        topicStrengths: [],
        weakTopics: [],
        strongTopics: [],
        averageStrength: 0,
        metadata: {
          totalTopics: 0,
          totalQuestionsAnalyzed: 0,
          recommendedFocus: []
        }
      });
    }

    // Aggregate data by topic
    const topicMap = new Map();

    sessions.forEach(session => {
      if (session.questions && session.questions.length > 0) {
        session.questions.forEach(q => {
          const topic = q.topic || 'General';
          
          if (!topicMap.has(topic)) {
            topicMap.set(topic, {
              topic,
              total: 0,
              answered: 0,
              correct: 0,
              pinned: 0,
              difficulty: { Easy: 0, Medium: 0, Hard: 0 },
              relatedRoles: new Set(),
              relatedFocusAreas: new Set()
            });
          }

          const data = topicMap.get(topic);
          data.total++;
          
          if (q.userAnswer) {
            data.answered++;
            if (q.isCorrect) data.correct++;
          }
          
          if (q.isPinned) data.pinned++;
          if (q.difficulty) data.difficulty[q.difficulty]++;
          
          if (session.role) data.relatedRoles.add(session.role);
          if (session.focusAreas) {
            session.focusAreas.forEach(area => data.relatedFocusAreas.add(area));
          }
        });
      }
    });

    // Calculate strength scores per topic (0-100)
    const topicStrengths = Array.from(topicMap.values()).map(data => {
      // Accuracy component (50 points)
      const accuracyRate = data.answered > 0 ? data.correct / data.answered : 0;
      const accuracyScore = accuracyRate * 50;

      // Engagement component (30 points) - answering rate
      const engagementRate = data.total > 0 ? data.answered / data.total : 0;
      const engagementScore = engagementRate * 30;

      // Mastery component (20 points) - weighted by difficulty
      const hardCorrectRate = data.difficulty.Hard > 0 
        ? (data.correct / data.answered) * (data.difficulty.Hard / data.total) 
        : 0;
      const masteryScore = (accuracyRate * 0.7 + hardCorrectRate * 0.3) * 20;

      const strengthScore = Math.round(accuracyScore + engagementScore + masteryScore);

      // Determine strength level
      let level, color;
      if (strengthScore >= 80) {
        level = 'Expert';
        color = '#10b981'; // green
      } else if (strengthScore >= 60) {
        level = 'Proficient';
        color = '#22d3ee'; // cyan
      } else if (strengthScore >= 40) {
        level = 'Developing';
        color = '#f59e0b'; // orange
      } else if (strengthScore >= 20) {
        level = 'Weak';
        color = '#f97316'; // deep orange
      } else {
        level = 'Critical';
        color = '#ef4444'; // red
      }

      return {
        topic: data.topic,
        strengthScore,
        level,
        color,
        stats: {
          total: data.total,
          answered: data.answered,
          correct: data.correct,
          pinned: data.pinned,
          accuracyRate: Math.round(accuracyRate * 100),
          engagementRate: Math.round(engagementRate * 100)
        },
        difficulty: data.difficulty,
        relatedRoles: Array.from(data.relatedRoles),
        relatedFocusAreas: Array.from(data.relatedFocusAreas),
        needsAttention: strengthScore < 40
      };
    });

    // Sort by strength score (ascending to show weak topics first)
    topicStrengths.sort((a, b) => a.strengthScore - b.strengthScore);

    // Identify weak and strong topics
    const weakTopics = topicStrengths.filter(t => t.strengthScore < 40);
    const strongTopics = topicStrengths.filter(t => t.strengthScore >= 60);

    // Calculate average strength
    const averageStrength = topicStrengths.length > 0
      ? Math.round(topicStrengths.reduce((sum, t) => sum + t.strengthScore, 0) / topicStrengths.length)
      : 0;

    // Generate recommendations
    const recommendedFocus = weakTopics.slice(0, 3).map(t => ({
      topic: t.topic,
      reason: t.stats.answered === 0 
        ? 'Not attempted yet - start with basics'
        : t.stats.accuracyRate < 50
        ? `Low accuracy (${t.stats.accuracyRate}%) - review fundamentals`
        : 'Limited practice - increase engagement',
      suggestedAction: t.stats.answered === 0
        ? 'Generate practice questions for this topic'
        : t.stats.accuracyRate < 50
        ? 'Review AI explanations and retry missed questions'
        : 'Practice more questions to build confidence'
    }));

    console.log(`📊 Knowledge gap analysis complete: ${topicStrengths.length} topics, avg strength: ${averageStrength}`);

    res.status(200).json({
      success: true,
      topicStrengths,
      weakTopics,
      strongTopics,
      averageStrength,
      metadata: {
        totalTopics: topicStrengths.length,
        totalQuestionsAnalyzed: Array.from(topicMap.values()).reduce((sum, t) => sum + t.total, 0),
        recommendedFocus
      }
    });

  } catch (error) {
    console.error('Knowledge gap analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error analyzing knowledge gaps'
    });
  }
};

