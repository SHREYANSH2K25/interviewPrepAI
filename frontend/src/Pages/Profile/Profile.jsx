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
import ThemeToggle from '../../components/ThemeToggle';

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
  const completionRate = calculateCompletionRate();

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
      description: 'Templates created so far',
      icon: Target, 
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    { 
      label: 'Questions Answered', 
      value: stats.completedQuestions, 
      description: 'Practice moments logged',
      icon: CheckCircle2, 
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    { 
      label: 'Current Streak', 
      value: `${stats.streak} days`, 
      description: 'Keep the habit alive',
      icon: Zap, 
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    { 
      label: 'Average Score', 
      value: `${stats.averageScore}%`, 
      description: 'Self-reviewed accuracy',
      icon: TrendingUp, 
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  const unlockedAchievementsCount = defaultAchievements.filter((achievement) => achievement.unlocked).length;

  const focusAreaSet = new Set();
  recentSessions.forEach((session) => {
    session.focusAreas?.forEach((area) => focusAreaSet.add(area));
  });

  const journeyHighlights = [
    {
      label: 'Focus areas tagged',
      value: focusAreaSet.size || '—',
      description: 'Across recent sessions',
    },
    {
      label: 'Achievements unlocked',
      value: `${unlockedAchievementsCount}/${defaultAchievements.length}`,
      description: 'Milestones collected so far',
    },
    {
      label: 'Last active',
      value: formatDate(stats.lastActive),
      description: stats.streak ? `${stats.streak}-day streak` : 'Streak ready to begin',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden text-slate-900 dark:text-slate-100">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute w-96 h-96 bg-orange-400/24 blur-3xl rounded-full -top-12 -left-16" />
        <div className="absolute w-96 h-96 bg-indigo-400/18 blur-3xl rounded-full top-10 right-0" />
      </div>
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700/50 sticky top-0 z-10 shadow-sm dark:shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </motion.button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-8 mb-8 border border-gray-200/70 dark:border-white/10 bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-900/80 dark:to-slate-900/60 shadow-xl"
        >
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute -top-10 -right-4 w-48 h-48 bg-orange-500/20 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-pink-500/20 blur-3xl rounded-full" />
          </div>
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex items-start gap-6 flex-1">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Profile</p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user?.name || 'User'}</h2>
                <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300">
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
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto lg:min-w-[280px]">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/70 dark:border-white/10 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-[0.2em]">Completion</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/70 dark:border-white/10 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-[0.2em]">Streak</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.streak}d</p>
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
              className="rounded-2xl p-6 border border-gray-200/70 dark:border-white/10 bg-white/95 dark:bg-slate-900/60 shadow-lg shadow-black/5 dark:shadow-black/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} dark:bg-white/10 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor} dark:text-white`} />
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {journeyHighlights.map((highlight) => (
            <div
              key={highlight.label}
              className="p-5 rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/85 dark:bg-slate-900/50 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">{highlight.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{highlight.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{highlight.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card elevated-hover rounded-2xl p-8 mb-8 border border-gray-200/70 dark:border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-orange-600" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Overall Progress</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion Rate</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${getProgressColor(completionRate)} rounded-full shadow-inner`}
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
            className="glass-card elevated-hover rounded-2xl p-8 border border-gray-200/70 dark:border-white/10"
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
                  className="mt-4 px-6 py-2 btn-primary text-white rounded-lg"
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
                    className="flex items-center justify-between p-4 bg-white/85 dark:bg-slate-900/50 rounded-lg hover:bg-orange-50/70 transition-all cursor-pointer border border-gray-200 hover:border-orange-300 dark:border-white/10"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{session.role}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{session.experience} • {session.questions?.length || 0} questions</p>
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
            className="glass-card elevated-hover rounded-2xl p-8 border border-gray-200/70 dark:border-white/10"
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
                  className={`p-4 rounded-2xl border transition-all shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-white/95 via-amber-50/80 to-pink-50/70 border-orange-200/70 dark:from-slate-900/80 dark:via-orange-500/15 dark:to-pink-500/15 dark:border-white/10'
                      : 'bg-white/80 dark:bg-slate-900/60 border-white/50 dark:border-white/10'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-orange-500 to-pink-500 border-transparent shadow-lg shadow-orange-500/40 text-white'
                        : 'bg-white/10 dark:bg-slate-800/70 border-white/20 dark:border-white/15 text-gray-500 dark:text-gray-300'
                    }`}>
                      <achievement.icon className={`w-6 h-6 drop-shadow-sm ${achievement.unlocked ? 'text-white' : 'text-gray-500 dark:text-gray-300'}`} />
                    </div>
                    <h4 className={`font-bold text-sm mb-1 ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-xs ${achievement.unlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                      {achievement.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-bold text-orange-600">
                  {unlockedAchievementsCount}
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
