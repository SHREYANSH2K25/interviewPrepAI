import Session from '../models/Session.js';
import Question from '../models/Question.js';

// Get user profile statistics
export const getProfileStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all user sessions
    const sessions = await Session.find({ userId }).populate('questions');
    
    // Calculate statistics
    const totalSessions = sessions.length;
    let totalQuestions = 0;
    let completedQuestions = 0;

    sessions.forEach(session => {
      totalQuestions += session.questions.length;
      session.questions.forEach(question => {
        if (question.isPinned || question.notes) {
          completedQuestions++;
        }
      });
    });

    // Calculate average score (simulated for now, can be enhanced with actual scoring)
    const averageScore = totalQuestions > 0 
      ? Math.round((completedQuestions / totalQuestions) * 100)
      : 0;

    // Calculate streak (days of consecutive activity)
    const streak = await calculateStreak(userId);

    // Get last active date
    const lastActive = sessions.length > 0
      ? sessions.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))[0].lastUpdated
      : null;

    // Calculate achievements
    const achievements = calculateAchievements({
      totalSessions,
      completedQuestions,
      averageScore,
      streak,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalSessions,
        totalQuestions,
        completedQuestions,
        averageScore,
        streak,
        lastActive,
      },
      achievements,
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile statistics',
      error: error.message,
    });
  }
};

// Helper function to calculate user streak
const calculateStreak = async (userId) => {
  try {
    const sessions = await Session.find({ userId })
      .sort({ lastUpdated: -1 })
      .select('lastUpdated');

    if (sessions.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's activity today or yesterday
    const lastActivityDate = new Date(sessions[0].lastUpdated);
    lastActivityDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today - lastActivityDate) / (1000 * 60 * 60 * 24));
    
    // If last activity was more than 1 day ago, streak is broken
    if (daysDiff > 1) return 0;

    // Calculate consecutive days
    for (let i = 1; i < sessions.length; i++) {
      const currentDate = new Date(sessions[i - 1].lastUpdated);
      const previousDate = new Date(sessions[i].lastUpdated);
      
      currentDate.setHours(0, 0, 0, 0);
      previousDate.setHours(0, 0, 0, 0);

      const diff = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));

      if (diff === 1) {
        streak++;
      } else if (diff > 1) {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
};

// Helper function to calculate achievements
const calculateAchievements = (stats) => {
  const achievements = [];

  if (stats.totalSessions >= 1) {
    achievements.push({
      id: 'first_session',
      title: 'First Session',
      description: 'Created your first interview session',
      unlocked: true,
    });
  }

  if (stats.completedQuestions >= 50) {
    achievements.push({
      id: 'question_master',
      title: 'Question Master',
      description: 'Answered 50+ questions',
      unlocked: true,
    });
  }

  if (stats.streak >= 7) {
    achievements.push({
      id: 'consistent_learner',
      title: 'Consistent Learner',
      description: 'Maintained 7-day streak',
      unlocked: true,
    });
  }

  if (stats.averageScore >= 90) {
    achievements.push({
      id: 'high_achiever',
      title: 'High Achiever',
      description: 'Scored 90%+ average',
      unlocked: true,
    });
  }

  if (stats.totalSessions >= 10) {
    achievements.push({
      id: 'session_pro',
      title: 'Session Pro',
      description: 'Created 10+ sessions',
      unlocked: true,
    });
  }

  if (stats.completedQuestions >= 100) {
    achievements.push({
      id: 'dedicated',
      title: 'Dedicated',
      description: 'Completed 100+ questions',
      unlocked: true,
    });
  }

  return achievements;
};
