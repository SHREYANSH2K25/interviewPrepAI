import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Target,
  Sparkles,
  X,
  Loader2,
  BarChart3
} from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import API_PATHS from '../utils/apiPaths';

const WeakConceptsPanel = () => {
  const [weakConcepts, setWeakConcepts] = useState([]);
  const [dueForReview, setDueForReview] = useState([]);
  const [improvementTrends, setImprovementTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('weak'); // 'weak', 'review', 'trends'

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [weakRes, dueRes, trendsRes] = await Promise.all([
        axiosInstance.get(API_PATHS.WEAK_CONCEPTS),
        axiosInstance.get(API_PATHS.DUE_FOR_REVIEW),
        axiosInstance.get(API_PATHS.IMPROVEMENT_TRENDS)
      ]);

      if (weakRes.data.success) {
        setWeakConcepts(weakRes.data.weakConcepts);
      }
      if (dueRes.data.success) {
        setDueForReview(dueRes.data.dueForReview);
      }
      if (trendsRes.data.success) {
        setImprovementTrends(trendsRes.data.trends);
      }
    } catch (error) {
      console.error('Failed to fetch concept data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMasteryColor = (level) => {
    switch (level) {
      case 'Struggling':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Learning':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Practicing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Proficient':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Mastered':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      High: 'bg-red-500 text-white',
      Medium: 'bg-orange-500 text-white',
      Low: 'bg-gray-500 text-white'
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[priority]}`}>
        {priority} Priority
      </span>
    );
  };

  const formatNextReview = (date) => {
    const days = Math.ceil((new Date(date) - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  if (loading) {
    return (
      <div className="glass-card p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Brain className="w-7 h-7 text-purple-500" />
            Mistake Memory System
          </h2>
          <p className="text-gray-400 mt-1">
            Spaced repetition learning based on your struggle patterns
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('weak')}
          className={`px-4 py-2 font-medium transition-all relative ${
            activeTab === 'weak'
              ? 'text-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Weak Concepts
          {weakConcepts.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {weakConcepts.length}
            </span>
          )}
          {activeTab === 'weak' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-2 font-medium transition-all relative ${
            activeTab === 'review'
              ? 'text-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Due for Review
          {dueForReview.length > 0 && (
            <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              {dueForReview.length}
            </span>
          )}
          {activeTab === 'review' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`px-4 py-2 font-medium transition-all relative ${
            activeTab === 'trends'
              ? 'text-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Progress Trends
          {activeTab === 'trends' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
            />
          )}
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'weak' && (
          <motion.div
            key="weak"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {weakConcepts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-xl font-semibold mb-2">No Weak Concepts!</h3>
                <p className="text-gray-400">
                  You're doing great! Keep practicing to maintain your skills.
                </p>
              </div>
            ) : (
              weakConcepts.map((concept, index) => (
                <motion.div
                  key={concept._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border-2 ${getMasteryColor(
                    concept.masteryLevel
                  )}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{concept.topic}</h3>
                        {getPriorityBadge(concept.priority)}
                      </div>
                      <p className="text-xs text-gray-400">{concept.conceptFingerprint}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{concept.masteryLevel}</div>
                      <div className="text-xs text-gray-400">
                        {concept.mistakeCount + concept.correctCount} attempts
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Target className="w-3 h-3" />
                      <span>
                        {Math.round(
                          (concept.correctCount / (concept.correctCount + concept.mistakeCount)) * 100
                        )}% accuracy
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>Next: {formatNextReview(concept.nextReviewAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {concept.isImproving ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="text-green-400">Improving</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 text-orange-400" />
                          <span className="text-orange-400">Needs work</span>
                        </>
                      )}
                    </div>
                  </div>

                  {concept.isImproving && (
                    <div className="mt-2 text-xs bg-green-500/10 text-green-300 px-2 py-1 rounded">
                      +{concept.improvementScore}% improvement
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {dueForReview.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                <p className="text-gray-400">
                  No concepts are due for review right now. Come back later.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 text-orange-400 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-bold">Time to Practice!</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {dueForReview.length} concept{dueForReview.length > 1 ? 's are' : ' is'} ready for review
                    using spaced repetition. Practice now to reinforce your memory!
                  </p>
                </div>

                {dueForReview.map((concept, index) => (
                  <motion.div
                    key={concept._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border-2 border-orange-500/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{concept.topic}</h3>
                        <p className="text-xs text-gray-400 mb-2">
                          Interval: {concept.reviewInterval} days | Consecutive: {concept.consecutiveCorrect}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getMasteryColor(concept.masteryLevel)}`}>
                            {concept.masteryLevel}
                          </span>
                          {getPriorityBadge(concept.priority)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-orange-400">
                          {formatNextReview(concept.nextReviewAt)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {concept.mistakeCount} mistakes
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'trends' && improvementTrends && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-400">
                  {improvementTrends.totalPatterns}
                </div>
                <div className="text-sm text-gray-400">Total Concepts</div>
              </div>
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">
                  {improvementTrends.improvingCount}
                </div>
                <div className="text-sm text-gray-400">Improving</div>
              </div>
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-400">
                  {improvementTrends.averageImprovement}%
                </div>
                <div className="text-sm text-gray-400">Avg Improvement</div>
              </div>
              <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/30">
                <div className="text-2xl font-bold text-cyan-400">
                  {Object.values(improvementTrends.masteryDistribution).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-sm text-gray-400">Tracked Patterns</div>
              </div>
            </div>

            {/* Mastery Distribution */}
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Mastery Distribution
              </h3>
              <div className="space-y-2">
                {Object.entries(improvementTrends.masteryDistribution).map(([level, count]) => (
                  <div key={level} className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-24">{level}</span>
                    <div className="flex-1 h-8 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full flex items-center justify-end px-3 ${
                          level === 'Mastered' ? 'bg-green-500' :
                          level === 'Proficient' ? 'bg-cyan-500' :
                          level === 'Practicing' ? 'bg-blue-500' :
                          level === 'Learning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(count / improvementTrends.totalPatterns) * 100}%` }}
                      >
                        <span className="text-xs font-bold text-white">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Improving Topics */}
            {improvementTrends.topImproving.length > 0 && (
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Top Improving Topics
                </h3>
                <div className="space-y-2">
                  {improvementTrends.topImproving.map((topic, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{topic.topic}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-400">
                            +{topic.improvementScore}%
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getMasteryColor(topic.masteryLevel)}`}>
                            {topic.masteryLevel}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeakConceptsPanel;
