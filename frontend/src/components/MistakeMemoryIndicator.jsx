import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Award,
  Brain,
  X
} from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import API_PATHS from '../utils/apiPaths';

const MistakeMemoryIndicator = ({ question, topic, onClose }) => {
  const [struggleInfo, setStruggleInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPreviousStruggle();
  }, [question]);

  const checkPreviousStruggle = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.CHECK_PREVIOUS_STRUGGLE, {
        params: { questionText: question, topic }
      });

      if (response.data.success && response.data.previouslyStruggled) {
        setStruggleInfo(response.data.pattern);
      } else {
        setStruggleInfo(null);
      }
    } catch (error) {
      console.error('Failed to check previous struggle:', error);
      setStruggleInfo(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !struggleInfo) {
    return null;
  }

  const getMasteryIcon = (level) => {
    switch (level) {
      case 'Mastered':
        return <Award className="w-5 h-5 text-green-400" />;
      case 'Proficient':
        return <Target className="w-5 h-5 text-cyan-400" />;
      case 'Practicing':
        return <Brain className="w-5 h-5 text-blue-400" />;
      case 'Learning':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getMasteryColor = (level) => {
    switch (level) {
      case 'Mastered':
        return 'from-green-500/20 to-green-600/10 border-green-500/30';
      case 'Proficient':
        return 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30';
      case 'Practicing':
        return 'from-blue-500/20 to-blue-600/10 border-blue-500/30';
      case 'Learning':
        return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
      default:
        return 'from-red-500/20 to-red-600/10 border-red-500/30';
    }
  };

  const getImprovementText = () => {
    if (struggleInfo.isImproving) {
      return {
        text: `You're improving! +${struggleInfo.improvementScore}% progress`,
        icon: <TrendingUp className="w-4 h-4 text-green-400" />,
        color: 'text-green-400'
      };
    } else if (struggleInfo.improvementScore < 30) {
      return {
        text: 'Keep practicing this concept',
        icon: <TrendingDown className="w-4 h-4 text-orange-400" />,
        color: 'text-orange-400'
      };
    } else {
      return {
        text: 'Steady progress',
        icon: <Clock className="w-4 h-4 text-blue-400" />,
        color: 'text-blue-400'
      };
    }
  };

  const improvement = getImprovementText();
  const daysSinceLastMistake = Math.floor(
    (Date.now() - new Date(struggleInfo.lastMistakeAt)) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -20, height: 0 }}
      className={`mb-4 rounded-2xl bg-gradient-to-br ${getMasteryColor(
        struggleInfo.masteryLevel
      )} border-2 p-4 shadow-lg`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5">{getMasteryIcon(struggleInfo.masteryLevel)}</div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm">Previously Struggled Concept</h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                {struggleInfo.masteryLevel}
              </span>
            </div>

            <p className="text-xs text-gray-300 mb-2">
              You've answered similar questions {struggleInfo.correctCount + struggleInfo.mistakeCount} times
              ({struggleInfo.correctCount} correct, {struggleInfo.mistakeCount} mistakes)
            </p>

            <div className="flex flex-wrap gap-2 items-center text-xs">
              {/* Improvement Indicator */}
              <div className={`flex items-center gap-1 ${improvement.color}`}>
                {improvement.icon}
                <span>{improvement.text}</span>
              </div>

              {/* Time since last mistake */}
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-3 h-3" />
                <span>
                  Last mistake: {daysSinceLastMistake === 0 ? 'today' : `${daysSinceLastMistake}d ago`}
                </span>
              </div>

              {/* Accuracy badge */}
              {struggleInfo.correctCount + struggleInfo.mistakeCount > 0 && (
                <div className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                  {Math.round(
                    (struggleInfo.correctCount / (struggleInfo.correctCount + struggleInfo.mistakeCount)) * 100
                  )}% accuracy
                </div>
              )}
            </div>

            {/* Improvement motivation */}
            {struggleInfo.isImproving && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-2 text-xs bg-green-500/20 text-green-300 px-3 py-1.5 rounded-lg border border-green-500/30"
              >
                🎉 Great job! You're getting better at this concept. Keep it up!
              </motion.div>
            )}
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MistakeMemoryIndicator;
