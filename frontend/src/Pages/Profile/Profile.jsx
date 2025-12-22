import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Clock,
  BookOpen,
  CheckCircle2,
  ArrowLeft,
  BarChart3,
  FileText,
  Zap,
  Trophy,
  Star,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useUser } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPaths';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalQuestions: 0,
    completedQuestions: 0,
    averageScore: 0,
    streak: 0,
    lastActive: null,
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [statsRes, sessionsRes] = await Promise.all([
        axiosInstance.get(API_PATHS.PROFILE_STATS),
        axiosInstance.get(API_PATHS.GET_SESSIONS),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setAchievements(statsRes.data.achievements || []);
      }

      if (sessionsRes.data.success) {
        // Get last 5 sessions
        const userSessions = sessionsRes.data.sessions.filter(s => !s.isDefault);
        setRecentSessions(userSessions.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletionRate = () => {
    if (stats.totalQuestions === 0) return 0;
    return Math.round((stats.completedQuestions / stats.totalQuestions) * 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-600';
    if (percentage >= 50) return 'from-blue-500 to-cyan-600';
    if (percentage >= 30) return 'from-orange-500 to-amber-600';
    return 'from-gray-400 to-gray-500';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const defaultAchievements = [
    { id: 1, title: 'First Session', description: 'Created your first interview session', icon: Target, unlocked: stats.totalSessions >= 1, color: 'text-blue-500' },
    { id: 2, title: 'Question Master', description: 'Answered 50+ questions', icon: BookOpen, unlocked: stats.completedQuestions >= 50, color: 'text-purple-500' },
    { id: 3, title: 'Consistent Learner', description: 'Maintained 7-day streak', icon: Zap, unlocked: stats.streak >= 7, color: 'text-yellow-500' },
    { id: 4, title: 'High Achiever', description: 'Scored 90%+ average', icon: Trophy, unlocked: stats.averageScore >= 90, color: 'text-orange-500' },
    { id: 5, title: 'Session Pro', description: 'Created 10+ sessions', icon: Star, unlocked: stats.totalSessions >= 10, color: 'text-green-500' },
    { id: 6, title: 'Dedicated', description: 'Completed 100+ questions', icon: Award, unlocked: stats.completedQuestions >= 100, color: 'text-red-500' },
  ];

  const statsCards = [
    { 
      label: 'Total Sessions', 
      value: stats.totalSessions, 
      icon: Target, 
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    { 
      label: 'Questions Answered', 
      value: stats.completedQuestions, 
      icon: CheckCircle2, 
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    { 
      label: 'Current Streak', 
      value: `${stats.streak} days`, 
      icon: Zap, 
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    { 
      label: 'Average Score', 
      value: `${stats.averageScore}%`, 
      icon: TrendingUp, 
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </motion.button>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100"
        >
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.name || 'User'}</h2>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(user?.createdAt)}</span>
                </div>
                {stats.lastActive && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Last active {formatDate(stats.lastActive)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-orange-600" />
            <h3 className="text-2xl font-bold text-gray-900">Overall Progress</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                <span className="text-sm font-bold text-gray-900">{calculateCompletionRate()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateCompletionRate()}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full bg-linear-to-r ${getProgressColor(calculateCompletionRate())} rounded-full`}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
                <p className="text-sm text-gray-600">Total Questions</p>
              </div>
              <div className="text-center border-l border-r border-gray-200">
                <p className="text-2xl font-bold text-green-600">{stats.completedQuestions}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.totalQuestions - stats.completedQuestions}</p>
                <p className="text-sm text-gray-600">Remaining</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sessions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-900">Recent Sessions</h3>
            </div>

            {recentSessions.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No sessions created yet</p>
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Create Your First Session
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session, index) => (
                  <motion.div
                    key={session._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    onClick={() => navigate(`/interview/${session._id}`)}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-all cursor-pointer border border-gray-200 hover:border-orange-300"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{session.role}</h4>
                      <p className="text-sm text-gray-600">{session.experience} • {session.questions?.length || 0} questions</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-900">Achievements</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {defaultAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.unlocked
                      ? 'bg-linear-to-br from-yellow-50 to-orange-50 border-orange-300 shadow-md'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full ${achievement.unlocked ? 'bg-white' : 'bg-gray-200'} flex items-center justify-center mb-3 shadow-sm`}>
                      <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? achievement.color : 'text-gray-400'}`} />
                    </div>
                    <h4 className={`font-bold text-sm mb-1 ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-xs ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-orange-600">
                  {defaultAchievements.filter(a => a.unlocked).length}
                </span>
                /{defaultAchievements.length} Achievements Unlocked
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
