import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Pin,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Search,
  Filter,
  Brain,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Lightbulb,
  StickyNote,
  TrendingUp,
  BarChart3,
  Shuffle,
  Award,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  User,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useUser } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPaths';
import { defaultSessions } from '../Home/Dashboard';
import MistakeMemoryIndicator from '../../components/MistakeMemoryIndicator';

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loadingExplanations, setLoadingExplanations] = useState({});
  const [visibleCount, setVisibleCount] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Advanced features state
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [practiceMode, setPracticeMode] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(new Set());
  const [notes, setNotes] = useState({});
  const [showHint, setShowHint] = useState({});
  const [studyTimer, setStudyTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState('study'); // 'study' | 'practice' | 'review'
  const [userAnswers, setUserAnswers] = useState({});
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [evaluations, setEvaluations] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchSession();
  }, [sessionId, isAuthenticated, navigate]);

  const fetchSession = async () => {
    try {
      // Check if it's a default session
      if (sessionId.startsWith('default-')) {
        // Import default sessions from Dashboard (you'll need to export this)
        const defaultSession = getDefaultSession(sessionId);
        if (defaultSession) {
          setSession(defaultSession);
          setSelectedQuestion(defaultSession.questions[0]); // Select first question
        } else {
          navigate('/dashboard');
        }
      } else {
        const response = await axiosInstance.get(API_PATHS.sessions.getById(sessionId));
        if (response.data.success) {
          const sessionData = response.data.session;
          setSession(sessionData);
          
          // Restore progress from saved data
          if (sessionData.questions && sessionData.questions.length > 0) {
            const answeredSet = new Set();
            const correctSet = new Set();
            const answersMap = {};
            const evalMap = {};
            const notesMap = {};
            
            sessionData.questions.forEach(q => {
              const qId = q._id || q.question;
              
              // Restore user answers
              if (q.userAnswer) {
                answersMap[qId] = q.userAnswer;
                answeredSet.add(qId);
                
                // Restore correctness
                if (q.isCorrect) {
                  correctSet.add(qId);
                }
                
                // Create evaluation object from saved data
                evalMap[qId] = {
                  isCorrect: q.isCorrect || false,
                  score: q.isCorrect ? 85 : 45, // Approximate score
                  feedback: q.isCorrect 
                    ? 'Your answer was marked as correct.'
                    : 'Your answer needs improvement.',
                  strengths: q.isCorrect ? ['Answered correctly'] : [],
                  improvements: q.isCorrect ? [] : ['Review the concept'],
                  keyPointsCovered: [],
                  keyPointsMissed: []
                };
              }
              
              // Restore notes
              if (q.notes) {
                notesMap[qId] = q.notes;
              }
            });
            
            setUserAnswers(answersMap);
            setAnsweredQuestions(answeredSet);
            setCorrectAnswers(correctSet);
            setEvaluations(evalMap);
            setNotes(notesMap);
            setSelectedQuestion(sessionData.questions[0]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSession = (id) => {
    return defaultSessions.find(s => s._id === id);
  };

  const selectQuestion = (question) => {
    setSelectedQuestion(question);
  };

  const toggleExpand = (questionId) => {
    const question = session.questions.find(q => q._id === questionId);
    if (question) {
      setSelectedQuestion(question);
    }
  };

  const handlePinQuestion = async (questionId) => {
    try {
      const response = await axiosInstance.patch(API_PATHS.questions.pin(questionId));
      if (response.data.success) {
        setSession((prev) => ({
          ...prev,
          questions: prev.questions.map((q) =>
            q._id === questionId ? { ...q, isPinned: !q.isPinned } : q
          ),
        }));
      }
    } catch (error) {
      console.error('Failed to pin question:', error);
    }
  };
  const handleExplainConcept = async (questionId) => {
    console.log('handleExplainConcept called with:', { questionId, sessionId, hasSessionId: !!session?._id });
    
    // For default sessions, show a mock explanation
    if (sessionId.startsWith('default-') || !session?._id || session?.isDefault) {
      console.log('Using mock explanation for default session');
      const questionIdentifier = selectedQuestion._id || selectedQuestion.question;
      setSession((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => {
          const qId = q._id || q.question;
          return qId === questionIdentifier
            ? { 
                ...q, 
                conceptExplanation: `## Detailed Concept Explanation

This question is fundamental to understanding ${session.role.toLowerCase()} development and is commonly asked in technical interviews.

### Core Concepts

The underlying principles here involve understanding how modern development practices solve real-world problems efficiently. This concept demonstrates your grasp of both theoretical knowledge and practical application.

### Key Points to Remember

- **Performance Implications**: Understanding how this affects application performance is crucial
- **Best Practices**: Following industry standards ensures maintainable and scalable code
- **Common Pitfalls**: Be aware of edge cases and potential issues
- **Real-World Applications**: This concept is used extensively in production environments

### Practical Examples

In real-world scenarios, this concept helps developers:
1. Write more efficient and maintainable code
2. Debug issues faster by understanding the underlying mechanism
3. Make informed architectural decisions
4. Optimize application performance

### Interview Tips

When answering this question, demonstrate:
- Deep understanding of the fundamentals
- Awareness of trade-offs and alternatives
- Practical experience with real implementations
- Ability to explain complex concepts clearly

This topic is essential because it shows your problem-solving approach and technical depth.`
              }
            : q;
        }),
      }));
      setSelectedQuestion(prev => {
        const prevId = prev._id || prev.question;
        return prevId === questionIdentifier ? {
          ...prev,
          conceptExplanation: `## Detailed Concept Explanation

This question is fundamental to understanding ${session.role.toLowerCase()} development and is commonly asked in technical interviews.

### Core Concepts

The underlying principles here involve understanding how modern development practices solve real-world problems efficiently. This concept demonstrates your grasp of both theoretical knowledge and practical application.

### Key Points to Remember

- **Performance Implications**: Understanding how this affects application performance is crucial
- **Best Practices**: Following industry standards ensures maintainable and scalable code
- **Common Pitfalls**: Be aware of edge cases and potential issues
- **Real-World Applications**: This concept is used extensively in production environments

### Practical Examples

In real-world scenarios, this concept helps developers:
1. Write more efficient and maintainable code
2. Debug issues faster by understanding the underlying mechanism
3. Make informed architectural decisions
4. Optimize application performance

### Interview Tips

When answering this question, demonstrate:
- Deep understanding of the fundamentals
- Awareness of trade-offs and alternatives
- Practical experience with real implementations
- Ability to explain complex concepts clearly

This topic is essential because it shows your problem-solving approach and technical depth.`
        } : prev;
      });
      return;
    }

    console.log('Making API call to generate explanation for real session');
    setLoadingExplanations((prev) => ({ ...prev, [questionId]: true }));

    try {
      const apiUrl = API_PATHS.ai.explainConcept(questionId);
      console.log('API URL:', apiUrl);
      const response = await axiosInstance.post(apiUrl);
      if (response.data.success) {
        setSession((prev) => ({
          ...prev,
          questions: prev.questions.map((q) =>
            q._id === questionId
              ? { ...q, conceptExplanation: response.data.explanation }
              : q
          ),
        }));
        setSelectedQuestion(prev => prev._id === questionId ? {
          ...prev,
          conceptExplanation: response.data.explanation
        } : prev);
      }
    } catch (error) {
      console.error('Failed to generate explanation:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate explanation';
      alert(`Error generating explanation: ${errorMessage}\n\nThis feature works for custom sessions created through the dashboard. Default sessions use pre-generated explanations.`);
    } finally {
      setLoadingExplanations((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 10);
      setLoadingMore(false);
    }, 500);
  };

  // Advanced feature functions
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMarkAnswer = (questionId, isCorrect) => {
    setAnsweredQuestions(prev => new Set([...prev, questionId]));
    if (isCorrect) {
      setCorrectAnswers(prev => new Set([...prev, questionId]));
    } else {
      setCorrectAnswers(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  const handleSubmitAnswer = async (questionId) => {
    const userAnswer = userAnswers[questionId];
    if (!userAnswer || !userAnswer.trim()) {
      alert('Please write your answer before submitting');
      return;
    }

    // For default sessions, use mock evaluation
    if (sessionId.startsWith('default-') || !session?._id || session?.isDefault) {
      const mockEvaluation = {
        isCorrect: userAnswer.length > 20,
        score: Math.min(75 + Math.floor(userAnswer.length / 10), 100),
        feedback: 'This is a demo session. Create a custom session to get AI-powered evaluation.',
        strengths: ['Attempted the question'],
        improvements: ['Create a custom session for detailed feedback'],
        keyPointsCovered: [],
        keyPointsMissed: []
      };
      setEvaluations(prev => ({ ...prev, [questionId]: mockEvaluation }));
      handleMarkAnswer(questionId, mockEvaluation.isCorrect);
      setAnsweredQuestions(prev => new Set([...prev, questionId]));
      return;
    }

    setSubmittingAnswer(true);
    try {
      const response = await axiosInstance.patch(API_PATHS.questions.submitAnswer(questionId), {
        userAnswer
      });

      if (response.data.success) {
        const evaluation = response.data.evaluation;
        const isCorrect = evaluation.isCorrect;

        console.log('✅ Answer submitted successfully:', {
          questionId,
          isCorrect,
          score: evaluation.score,
          evaluation
        });

        // Store evaluation
        setEvaluations(prev => ({ ...prev, [questionId]: evaluation }));

        // Update local state
        setAnsweredQuestions(prev => new Set([...prev, questionId]));
        if (isCorrect) {
          setCorrectAnswers(prev => new Set([...prev, questionId]));
        }

        // Update session with the submitted answer
        setSession(prev => ({
          ...prev,
          questions: prev.questions.map(q =>
            q._id === questionId
              ? { ...q, userAnswer, isCorrect }
              : q
          )
        }));

        // Update selected question
        if (selectedQuestion._id === questionId) {
          setSelectedQuestion(prev => ({ ...prev, userAnswer, isCorrect }));
        }

        console.log('💡 Progress saved. Score will update on Dashboard refresh.');
      }
    } catch (error) {
      console.error('❌ Failed to submit answer:', error);
      alert('Failed to evaluate answer. Please try again.');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleAddNote = (questionId, note) => {
    setNotes(prev => ({ ...prev, [questionId]: note }));
  };

  const toggleHint = (questionId) => {
    setShowHint(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'practice') {
      setPracticeMode(true);
    } else if (practiceMode) {
      setPracticeMode(false);
    }
  };

  const shuffleQuestions = () => {
    setSession(prev => ({
      ...prev,
      questions: [...prev.questions].sort(() => Math.random() - 0.5)
    }));
  };

  const resetProgress = () => {
    setAnsweredQuestions(new Set());
    setCorrectAnswers(new Set());
    setNotes({});
    setStudyTimer(0);
    setIsTimerRunning(false);
  };

  const generateHint = (question) => {
    const hints = [
      `Think about the core concept: ${question.question.split(' ').slice(0, 5).join(' ')}...`,
      'Consider the fundamental principles and best practices.',
      'Break down the problem into smaller components.',
      'Think about real-world applications and use cases.'
    ];
    return hints[Math.floor(Math.random() * hints.length)];
  };

  // Sort questions with pinned ones first
  const sortedQuestions = session?.questions ? [...session.questions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  }) : [];

  const filteredQuestions = sortedQuestions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || 
      (difficultyFilter === 'answered' && answeredQuestions.has(q._id || q.question)) ||
      (difficultyFilter === 'unanswered' && !answeredQuestions.has(q._id || q.question)) ||
      (difficultyFilter === 'correct' && correctAnswers.has(q._id || q.question));
    return matchesSearch && matchesDifficulty;
  });

  const visibleQuestions = filteredQuestions.slice(0, visibleCount);

  const stats = {
    total: session?.questions.length || 0,
    answered: answeredQuestions.size,
    correct: correctAnswers.size,
    accuracy: answeredQuestions.size > 0 ? Math.round((correctAnswers.size / answeredQuestions.size) * 100) : 0,
    timeSpent: studyTimer
  };

  const viewModes = [
    {
      id: 'study',
      title: 'Study mode',
      description: 'Expand answers with guided notes.',
    },
    {
      id: 'practice',
      title: 'Practice mode',
      description: 'Mark answers and track accuracy.',
    },
    {
      id: 'review',
      title: 'Review mode',
      description: 'Focus on stats, streaks, and notes.',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12 text-orange-600" />
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden text-slate-900 dark:text-slate-100">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute w-96 h-96 bg-orange-400/24 blur-3xl rounded-full -top-10 -left-12" />
        <div className="absolute w-96 h-96 bg-indigo-400/18 blur-3xl rounded-full top-12 right-0" />
      </div>
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card bg-white/90 dark:bg-slate-900/70 backdrop-blur-lg border-b border-gray-200/60 dark:border-white/10 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <motion.button
              onClick={() => navigate('/dashboard')}
              whileHover={{ x: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </motion.button>
            <motion.button
              onClick={() => navigate('/profile')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 btn-ghost rounded-lg transition-colors group"
              title="View Profile"
            >
              <User className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
            </motion.button>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold text-gray-900">{session.role}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {session.experience} • {session.questions.length} questions
              </p>
            </motion.div>
            {session.focusAreas && session.focusAreas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2"
              >
                {session.focusAreas.map((area, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-sm font-medium rounded-full border border-orange-200/50 shadow-sm"
                  >
                    {area}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3"
          >
            <div className="rounded-2xl p-4 border border-white/70 dark:border-white/15 bg-gradient-to-br from-white to-slate-50 shadow-[0_15px_40px_rgba(15,23,42,0.12)] dark:from-slate-900/70 dark:to-slate-900/40">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-xs text-slate-500">Progress</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.answered}/{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-4 border border-white/70 dark:border-white/15 bg-gradient-to-br from-white to-slate-50 shadow-[0_15px_40px_rgba(15,23,42,0.12)] dark:from-slate-900/70 dark:to-slate-900/40">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs text-slate-500">Accuracy</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.accuracy}%</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-4 border border-white/70 dark:border-white/15 bg-gradient-to-br from-white to-slate-50 shadow-[0_15px_40px_rgba(15,23,42,0.12)] dark:from-slate-900/70 dark:to-slate-900/40">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs text-slate-500">Time</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{formatTime(stats.timeSpent)}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="rounded-2xl p-4 border border-white/70 dark:border-white/15 bg-gradient-to-br from-white to-slate-50 hover:from-white hover:to-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.12)] transition-colors flex items-center justify-center gap-2 text-slate-900 dark:text-white dark:from-slate-900/70 dark:to-slate-900/40"
            >
              {isTimerRunning ? (
                <><PauseCircle className="w-5 h-5 text-orange-600" /><span className="text-sm font-medium">Pause</span></>
              ) : (
                <><PlayCircle className="w-5 h-5 text-green-600" /><span className="text-sm font-medium">Start</span></>
              )}
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className="rounded-2xl p-4 border border-white/70 dark:border-white/15 bg-gradient-to-br from-white to-slate-50 hover:from-white hover:to-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.12)] transition-colors flex items-center justify-center gap-2 text-slate-900 dark:text-white dark:from-slate-900/70 dark:to-slate-900/40"
            >
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium">Stats</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-5 rounded-2xl border border-white/70 dark:border-white/10 bg-gradient-to-r from-white/95 via-orange-50/70 to-pink-50/60 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/50 backdrop-blur flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between shadow-[0_20px_45px_rgba(248,113,113,0.18)]"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Workspace mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Pick how you want to study today.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {viewModes.map((mode) => {
                const isActive = viewMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => handleViewModeChange(mode.id)}
                    className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-transparent shadow-lg shadow-orange-500/30'
                        : 'bg-white/80 dark:bg-slate-800/70 text-gray-700 dark:text-gray-200 border-gray-200/70 dark:border-white/10 hover:text-orange-600'
                    }`}
                  >
                    <div className="text-left">
                      <p>{mode.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{mode.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Stats Modal */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStats(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Study Statistics</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <Trophy className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Answered</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.answered}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Accuracy Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.accuracy}%</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <Clock className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Study Time</p>
                  <p className="text-3xl font-bold text-gray-900">{formatTime(stats.timeSpent)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetProgress}
                  className="flex-1 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset Progress
                </button>
                <button
                  onClick={() => setShowStats(false)}
                  className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Split View */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-white/95 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-900/60 border border-white/70 dark:border-white/10 rounded-2xl p-5 shadow-[0_20px_55px_rgba(15,23,42,0.12)] flex flex-wrap gap-4 items-center justify-between"
        >
          <div className="flex gap-3 items-center flex-wrap flex-1">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/70 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/70 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/70 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/70"
            >
              <option value="all">All Questions</option>
              <option value="answered">Answered</option>
              <option value="unanswered">Unanswered</option>
              <option value="correct">Correct</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={shuffleQuestions}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 hover:from-indigo-500/25 hover:to-purple-500/25 text-purple-700 dark:text-purple-200 font-medium rounded-xl transition-all flex items-center gap-2 border border-purple-200/70 dark:border-purple-500/40"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle
            </button>
            <button
              onClick={() => handleViewModeChange(practiceMode ? 'study' : 'practice')}
              className={`px-4 py-2.5 font-medium rounded-xl transition-all flex items-center gap-2 border ${
                practiceMode
                  ? 'bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-700 border-orange-200 hover:from-orange-500/30 hover:to-pink-500/30'
                  : 'bg-white/70 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Brain className="w-4 h-4" />
              {practiceMode ? 'Practice Mode ON' : 'Practice Mode OFF'}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-320px)]">
          {/* Left Side - Questions List */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold text-gray-900"
              >
                Interview Questions
              </motion.h2>
              <span className="text-sm text-gray-500">
                {filteredQuestions.length} questions
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredQuestions.slice(0, visibleCount).map((question, index) => {
                  const questionId = question._id || question.question;
                  const isAnswered = answeredQuestions.has(questionId);
                  const isCorrect = correctAnswers.has(questionId);
                  
                  return (
                    <motion.div
                      key={questionId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      onClick={() => selectQuestion(question)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border shadow-sm ${
                        selectedQuestion?._id === question._id || (selectedQuestion === question && !question._id)
                          ? 'bg-gradient-to-r from-orange-100 to-rose-50 border-orange-200/80 dark:from-orange-400/20 dark:to-rose-400/20 text-slate-900 dark:text-white shadow-[0_15px_35px_rgba(248,113,113,0.25)]'
                          : 'bg-gradient-to-r from-white/95 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-900/60 border-white/70 dark:border-white/10 hover:border-orange-200/80 hover:shadow-[0_10px_25px_rgba(15,23,42,0.12)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          {isAnswered && (
                            <div className={`mt-0.5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                              {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                            </div>
                          )}
                          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
                            {index + 1}. {question.question}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {notes[questionId] && (
                            <StickyNote className="w-4 h-4 text-yellow-600 fill-current" />
                          )}
                          {question.isPinned && (
                            <Pin className="w-4 h-4 text-orange-600 fill-current" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-300">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                          isAnswered
                            ? isCorrect
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-red-50 text-red-600 border-red-100'
                            : 'bg-white/80 text-gray-600 border-gray-200'
                        }`}>
                          {isAnswered ? (isCorrect ? 'Correct' : 'Review needed') : 'New'}
                        </span>
                        <span>#{questionId.toString().slice(0, 4)}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Load More Button */}
              {visibleCount < filteredQuestions.length && (
                <motion.button
                  onClick={loadMore}
                  disabled={loadingMore}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-orange-500/90 to-pink-500/90 hover:from-orange-500 hover:to-pink-500 text-white font-semibold rounded-xl border border-transparent transition-all shadow-lg disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    `Load More (${filteredQuestions.length - visibleCount} remaining)`
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Right Side - Answer & Explanation */}
          <div className="flex flex-col min-h-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 rounded-2xl border border-white/70 dark:border-white/10 bg-gradient-to-r from-white/95 via-orange-50/70 to-pink-50/60 dark:from-slate-900/85 dark:via-slate-900/65 dark:to-slate-900/55 text-slate-900 dark:text-white shadow-[0_20px_45px_rgba(15,23,42,0.15)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-white/60">Workspace snapshot</p>
                  <p className="text-lg font-semibold">{viewModes.find((mode) => mode.id === viewMode)?.title || 'Study mode'}</p>
                </div>
                <button
                  onClick={() => setShowStats(true)}
                  className="px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/10 text-xs font-semibold border border-white/70 dark:border-white/30 text-gray-700 dark:text-white hover:bg-white"
                  type="button"
                >
                  View stats
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-white/70">Practice tools</p>
                  <p className="font-semibold">{practiceMode ? 'Enabled' : 'Off'}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-white/70">Pinned questions</p>
                  <p className="font-semibold">{session.questions?.filter((q) => q.isPinned).length || 0}</p>
                </div>
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Answer & Explanation
            </motion.h2>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {selectedQuestion ? (
                  <motion.div
                    key={selectedQuestion._id || 'selected'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl p-6 shadow-[0_25px_55px_rgba(15,23,42,0.12)] border border-white/70 dark:border-white/10 bg-gradient-to-br from-white/95 via-slate-50/70 to-slate-100/60 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/50"
                  >
                    {/* Question */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {selectedQuestion.question}
                      </h3>
                      
                      {/* Mistake Memory Indicator */}
                      <MistakeMemoryIndicator
                        question={selectedQuestion.question}
                        topic={selectedQuestion.topic || 'General'}
                      />
                      
                      <div className="flex flex-wrap gap-2">
                        {practiceMode && (
                          <>
                            <motion.button
                              onClick={() => handleMarkAnswer(selectedQuestion._id || selectedQuestion.question, true)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-all border border-green-300 flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Correct
                            </motion.button>
                            <motion.button
                              onClick={() => handleMarkAnswer(selectedQuestion._id || selectedQuestion.question, false)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-all border border-red-300 flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Wrong
                            </motion.button>
                          </>
                        )}
                        {selectedQuestion.isPinned !== undefined && (
                          <motion.button
                            onClick={() => handlePinQuestion(selectedQuestion._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border flex items-center gap-2 shadow-sm ${
                              selectedQuestion.isPinned
                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-transparent shadow-lg shadow-orange-500/30'
                                : 'bg-white/90 dark:bg-slate-900/60 text-gray-700 dark:text-gray-100 border-gray-200 dark:border-white/15 hover:text-orange-600'
                            }`}
                          >
                            <Pin className={`w-4 h-4 inline mr-1 ${selectedQuestion.isPinned ? 'fill-current' : ''}`} />
                            {selectedQuestion.isPinned ? 'Pinned' : 'Pin'}
                          </motion.button>
                        )}
                        <motion.button
                          onClick={() => toggleHint(selectedQuestion._id || selectedQuestion.question)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all border flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-50 dark:from-amber-400/20 dark:to-yellow-400/20 text-amber-700 dark:text-amber-100 border-amber-200/80 dark:border-amber-200/30 hover:shadow-[0_10px_25px_rgba(251,191,36,0.35)]"
                        >
                          <Lightbulb className="w-4 h-4" />
                          {showHint[selectedQuestion._id || selectedQuestion.question] ? 'Hide' : 'Show'} Hint
                        </motion.button>
                        {!selectedQuestion.conceptExplanation && (
                          <motion.button
                            onClick={() => handleExplainConcept(selectedQuestion._id || selectedQuestion.question)}
                            disabled={loadingExplanations[selectedQuestion._id || selectedQuestion.question]}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all border flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white border-transparent shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {loadingExplanations[selectedQuestion._id || selectedQuestion.question] ? (
                              <>
                                <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 inline mr-1" />
                                Explain Concept
                              </>
                            )}
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Your Answer Input */}
                    {!answeredQuestions.has(selectedQuestion._id || selectedQuestion.question) && (
                      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border border-orange-200 dark:border-orange-800">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Brain className="w-4 h-4 text-orange-600" />
                          Your Answer
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                          Write your answer below. After submitting, you'll self-assess if you answered correctly, which will update your readiness score.
                        </p>
                        <textarea
                          value={userAnswers[selectedQuestion._id || selectedQuestion.question] || ''}
                          onChange={(e) => setUserAnswers(prev => ({
                            ...prev,
                            [selectedQuestion._id || selectedQuestion.question]: e.target.value
                          }))}
                          placeholder="Type your answer here... (supports markdown syntax)"
                          rows={6}
                          className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 bg-white dark:bg-slate-900/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm text-gray-900 dark:text-white mb-3"
                        />
                        <motion.button
                          onClick={() => handleSubmitAnswer(selectedQuestion._id || selectedQuestion.question)}
                          disabled={submittingAnswer || !userAnswers[selectedQuestion._id || selectedQuestion.question]?.trim()}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          {submittingAnswer ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Evaluating with AI...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5" />
                              Submit for AI Evaluation
                            </>
                          )}
                        </motion.button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                          🤖 AI will automatically evaluate your answer and provide detailed feedback
                        </p>
                      </div>
                    )}

                    {/* Submitted Answer Display */}
                    {answeredQuestions.has(selectedQuestion._id || selectedQuestion.question) && userAnswers[selectedQuestion._id || selectedQuestion.question] && (
                      <div className="mb-6 space-y-4">
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <CheckCircle2 className={`w-4 h-4 ${correctAnswers.has(selectedQuestion._id || selectedQuestion.question) ? 'text-green-600' : 'text-red-600'}`} />
                            Your Submitted Answer
                            {correctAnswers.has(selectedQuestion._id || selectedQuestion.question) ? (
                              <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                                ✅ Correct
                              </span>
                            ) : (
                              <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full font-medium">
                                ❌ Needs Improvement
                              </span>
                            )}
                          </h4>
                          <div className="prose prose-slate max-w-none bg-white/80 dark:bg-slate-900/50 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                            <ReactMarkdown>{userAnswers[selectedQuestion._id || selectedQuestion.question]}</ReactMarkdown>
                          </div>
                        </div>

                        {/* AI Evaluation Feedback */}
                        {evaluations[selectedQuestion._id || selectedQuestion.question] && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800"
                          >
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-purple-600" />
                              AI Evaluation Feedback
                            </h4>

                            {/* Score */}
                            <div className="mb-4 flex items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Score</span>
                                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {evaluations[selectedQuestion._id || selectedQuestion.question].score}/100
                                  </span>
                                </div>
                                <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-1000"
                                    style={{ width: `${evaluations[selectedQuestion._id || selectedQuestion.question].score}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Feedback */}
                            <div className="mb-4 p-4 bg-white/80 dark:bg-slate-900/50 rounded-xl border border-purple-200 dark:border-purple-700">
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {evaluations[selectedQuestion._id || selectedQuestion.question].feedback}
                              </p>
                            </div>

                            {/* Strengths */}
                            {evaluations[selectedQuestion._id || selectedQuestion.question].strengths?.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
                                  <Award className="w-3.5 h-3.5" />
                                  Strengths
                                </p>
                                <ul className="space-y-1">
                                  {evaluations[selectedQuestion._id || selectedQuestion.question].strengths.map((strength, idx) => (
                                    <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                      <span className="text-green-600 mt-0.5">✓</span>
                                      {strength}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Improvements */}
                            {evaluations[selectedQuestion._id || selectedQuestion.question].improvements?.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  Areas for Improvement
                                </p>
                                <ul className="space-y-1">
                                  {evaluations[selectedQuestion._id || selectedQuestion.question].improvements.map((improvement, idx) => (
                                    <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                      <span className="text-orange-600 mt-0.5">→</span>
                                      {improvement}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Key Points */}
                            <div className="grid grid-cols-2 gap-4">
                              {evaluations[selectedQuestion._id || selectedQuestion.question].keyPointsCovered?.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">✓ Covered</p>
                                  <div className="flex flex-wrap gap-1">
                                    {evaluations[selectedQuestion._id || selectedQuestion.question].keyPointsCovered.map((point, idx) => (
                                      <span key={idx} className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                        {point}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {evaluations[selectedQuestion._id || selectedQuestion.question].keyPointsMissed?.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">✗ Missed</p>
                                  <div className="flex flex-wrap gap-1">
                                    {evaluations[selectedQuestion._id || selectedQuestion.question].keyPointsMissed.map((point, idx) => (
                                      <span key={idx} className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                                        {point}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Answer */}
                    {(!practiceMode || answeredQuestions.has(selectedQuestion._id || selectedQuestion.question)) && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-orange-600" />
                          Answer
                        </h4>
                        <div className="prose prose-slate max-w-none bg-white/90 dark:bg-slate-900/60 rounded-xl p-4 border border-gray-100 dark:border-white/10">
                          <ReactMarkdown
                            components={{
                              code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code
                                    className="bg-gray-200 px-1.5 py-0.5 rounded text-sm"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {selectedQuestion.answer}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {/* Hint Section */}
                    {showHint[selectedQuestion._id || selectedQuestion.question] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6"
                      >
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600" />
                          Hint
                        </h4>
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200/70">
                          <p className="text-gray-700 dark:text-gray-900 text-sm">
                            {generateHint(selectedQuestion)}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Notes Section */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <StickyNote className="w-4 h-4 text-purple-600" />
                        Personal Notes
                      </h4>
                      <textarea
                        value={notes[selectedQuestion._id || selectedQuestion.question] || ''}
                        onChange={(e) => handleAddNote(selectedQuestion._id || selectedQuestion.question, e.target.value)}
                        placeholder="Add your notes here..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm text-gray-900 dark:text-white"
                      />
                      {notes[selectedQuestion._id || selectedQuestion.question] && (
                        <p className="text-xs text-gray-500 mt-2">
                          Last updated: {new Date().toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Concept Explanation */}
                    {selectedQuestion.conceptExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 pt-6 border-t border-gray-200"
                      >
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          AI Concept Explanation
                        </h4>
                        <div className="prose prose-slate max-w-none bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-slate-900/75 dark:via-slate-900/60 dark:to-slate-900/45 rounded-2xl p-5 border border-blue-100/80 dark:border-white/10 shadow-[0_18px_40px_rgba(37,99,235,0.18)]">
                          <ReactMarkdown
                            components={{
                              code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code
                                    className="bg-gray-200 px-1.5 py-0.5 rounded text-sm"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {selectedQuestion.conceptExplanation}
                          </ReactMarkdown>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-full"
                  >
                    <div className="text-center text-gray-400">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Select a question to view answer</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewPrep;

