import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  BarChart3,
  X,
  Lightbulb,
  ArrowRight,
  Loader2
} from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import API_PATHS from '../utils/apiPaths';

const KnowledgeGapHeatmap = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap' or 'radar'

  useEffect(() => {
    fetchKnowledgeGaps();
  }, []);

  const fetchKnowledgeGaps = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.KNOWLEDGE_GAPS);
      if (response.data.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch knowledge gaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#22d3ee'; // cyan
    if (score >= 40) return '#f59e0b'; // orange
    if (score >= 20) return '#f97316'; // deep orange
    return '#ef4444'; // red
  };

  const getStrengthBgColor = (score) => {
    if (score >= 80) return 'rgba(16, 185, 129, 0.1)';
    if (score >= 60) return 'rgba(34, 211, 238, 0.1)';
    if (score >= 40) return 'rgba(245, 158, 11, 0.1)';
    if (score >= 20) return 'rgba(249, 115, 22, 0.1)';
    return 'rgba(239, 68, 68, 0.1)';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data || data.topicStrengths.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">No Topics Analyzed Yet</h3>
        <p className="text-gray-400">
          Start practicing questions to build your knowledge gap analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-blue-500" />
              Knowledge Gap Heatmap
            </h2>
            <p className="text-gray-400 mt-1">
              Visualize your strengths and weaknesses across topics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'heatmap'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Heatmap
            </button>
            <button
              onClick={() => setViewMode('radar')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'radar'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Radar Chart
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-4 border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">
              {data.metadata.totalTopics}
            </div>
            <div className="text-sm text-gray-400 mt-1">Topics Analyzed</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-4 border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">
              {data.averageStrength}%
            </div>
            <div className="text-sm text-gray-400 mt-1">Average Strength</div>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-4 border border-red-500/20">
            <div className="text-2xl font-bold text-red-400">
              {data.weakTopics.length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Weak Topics</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded-xl p-4 border border-cyan-500/20">
            <div className="text-2xl font-bold text-cyan-400">
              {data.strongTopics.length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Strong Topics</div>
          </div>
        </div>
      </div>

      {/* Heatmap View */}
      {viewMode === 'heatmap' && (
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.topicStrengths.map((topic, index) => (
              <motion.div
                key={topic.topic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedTopic(topic)}
                className="cursor-pointer group"
              >
                <div
                  className="relative p-5 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-2xl"
                  style={{
                    backgroundColor: getStrengthBgColor(topic.strengthScore),
                    borderColor: topic.color,
                  }}
                >
                  {/* Topic Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{topic.topic}</h3>
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full mt-1 inline-block"
                        style={{
                          backgroundColor: topic.color + '33',
                          color: topic.color,
                        }}
                      >
                        {topic.level}
                      </span>
                    </div>
                    <div
                      className="text-3xl font-bold"
                      style={{ color: topic.color }}
                    >
                      {topic.strengthScore}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${topic.strengthScore}%` }}
                      transition={{ delay: index * 0.05 + 0.2, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: topic.color }}
                    />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Target className="w-3 h-3" />
                      <span>
                        {topic.stats.correct}/{topic.stats.answered} correct
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <BarChart3 className="w-3 h-3" />
                      <span>{topic.stats.accuracyRate}% accuracy</span>
                    </div>
                  </div>

                  {/* Attention Badge */}
                  {topic.needsAttention && (
                    <div className="absolute top-2 right-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Radar Chart View */}
      {viewMode === 'radar' && (
        <div className="glass-card p-6">
          <RadarChart topics={data.topicStrengths} />
        </div>
      )}

      {/* Recommendations */}
      {data.metadata.recommendedFocus.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Recommended Focus Areas
          </h3>
          <div className="space-y-4">
            {data.metadata.recommendedFocus.map((rec, index) => (
              <motion.div
                key={rec.topic}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20"
              >
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-yellow-500 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-bold text-yellow-400">{rec.topic}</h4>
                    <p className="text-gray-300 text-sm mt-1">{rec.reason}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                      <ArrowRight className="w-4 h-4" />
                      <span>{rec.suggestedAction}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Topic Detail Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTopic(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedTopic.topic}</h2>
                  <span
                    className="text-sm font-medium px-3 py-1 rounded-full mt-2 inline-block"
                    style={{
                      backgroundColor: selectedTopic.color + '33',
                      color: selectedTopic.color,
                    }}
                  >
                    {selectedTopic.level} - {selectedTopic.strengthScore}%
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">
                    {selectedTopic.stats.total}
                  </div>
                  <div className="text-sm text-gray-400">Total Questions</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">
                    {selectedTopic.stats.answered}
                  </div>
                  <div className="text-sm text-gray-400">Answered</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-cyan-400">
                    {selectedTopic.stats.correct}
                  </div>
                  <div className="text-sm text-gray-400">Correct</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">
                    {selectedTopic.stats.accuracyRate}%
                  </div>
                  <div className="text-sm text-gray-400">Accuracy</div>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="mb-6">
                <h3 className="font-bold mb-3">Difficulty Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(selectedTopic.difficulty).map(([level, count]) => (
                    <div key={level} className="flex items-center gap-3">
                      <span className="text-sm text-gray-400 w-20">{level}</span>
                      <div className="flex-1 h-6 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-end px-2"
                          style={{
                            width: `${(count / selectedTopic.stats.total) * 100}%`,
                          }}
                        >
                          <span className="text-xs font-bold text-white">
                            {count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Info */}
              {selectedTopic.relatedRoles.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold mb-2">Related Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopic.relatedRoles.map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedTopic.relatedFocusAreas.length > 0 && (
                <div>
                  <h3 className="font-bold mb-2">Related Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopic.relatedFocusAreas.map((area) => (
                      <span
                        key={area}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Radar Chart Component
const RadarChart = ({ topics }) => {
  const chartSize = 400;
  const center = chartSize / 2;
  const maxRadius = chartSize / 2 - 60;
  const angleStep = (2 * Math.PI) / topics.length;

  const getPoint = (index, value) => {
    const angle = index * angleStep - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const axisPoints = topics.map((_, index) => getPoint(index, 100));
  const dataPoints = topics.map((topic, index) => getPoint(index, topic.strengthScore));

  const pathData = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="flex items-center justify-center">
      <svg width={chartSize} height={chartSize} className="overflow-visible">
        {/* Grid Circles */}
        {[20, 40, 60, 80, 100].map((value) => (
          <circle
            key={value}
            cx={center}
            cy={center}
            r={(value / 100) * maxRadius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {axisPoints.map((point, index) => (
          <g key={index}>
            <line
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
            <text
              x={point.x + (point.x - center) * 0.2}
              y={point.y + (point.y - center) * 0.2}
              textAnchor="middle"
              className="text-xs fill-gray-300 font-medium"
            >
              {topics[index].topic}
            </text>
          </g>
        ))}

        {/* Data Area */}
        <motion.path
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 0.6 }}
          d={pathData}
          fill="url(#radarGradient)"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Data Points */}
        {dataPoints.map((point, index) => (
          <motion.circle
            key={index}
            initial={{ opacity: 0, r: 0 }}
            animate={{ opacity: 1, r: 6 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            cx={point.x}
            cy={point.y}
            fill={topics[index].color}
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* Gradient Definition */}
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

export default KnowledgeGapHeatmap;
