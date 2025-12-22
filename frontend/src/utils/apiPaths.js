const API_PATHS = {
  // Auth endpoints
  AUTH_SIGNUP: '/auth/signup',
  AUTH_LOGIN: '/auth/login',
  AUTH_PROFILE: '/auth/profile',
  UPLOAD_IMAGE: '/auth/upload-image',
  
  // Session endpoints
  CREATE_SESSION: '/sessions',
  GET_SESSIONS: '/sessions',
  GET_SESSION: (id) => `/sessions/${id}`,
  DELETE_SESSION: (id) => `/sessions/${id}`,
  
  // Question endpoints
  ADD_QUESTION: (sessionId) => `/questions/${sessionId}`,
  PIN_QUESTION: (questionId) => `/questions/${questionId}/pin`,
  UPDATE_NOTES: (questionId) => `/questions/${questionId}/notes`,
  SUBMIT_ANSWER: (questionId) => `/questions/${questionId}/answer`,
  
  // AI endpoints
  GENERATE_QUESTIONS: '/ai/generate-questions',
  EXPLAIN_CONCEPT: (questionId) => `/ai/explain-concept/${questionId}`,
  EVALUATE_ANSWER: '/ai/evaluate-answer',
  
  // Profile endpoints
  PROFILE_STATS: '/profile/stats',
  
  // Analytics endpoints
  READINESS_SCORE: '/analytics/readiness-score',
  KNOWLEDGE_GAPS: '/analytics/knowledge-gaps',
  
  // Mistake tracking endpoints
  RECORD_MISTAKE: '/mistakes/record',
  WEAK_CONCEPTS: '/mistakes/weak-concepts',
  DUE_FOR_REVIEW: '/mistakes/due-for-review',
  IMPROVEMENT_TRENDS: '/mistakes/improvement-trends',
  CHECK_PREVIOUS_STRUGGLE: '/mistakes/check-previous-struggle',
  
  // Legacy support
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
    profile: '/auth/profile',
    uploadImage: '/auth/upload-image',
  },
  sessions: {
    create: '/sessions',
    getAll: '/sessions',
    getById: (id) => `/sessions/${id}`,
    delete: (id) => `/sessions/${id}`,
  },
  questions: {
    add: (sessionId) => `/questions/${sessionId}`,
    pin: (questionId) => `/questions/${questionId}/pin`,
    updateNotes: (questionId) => `/questions/${questionId}/notes`,
    submitAnswer: (questionId) => `/questions/${questionId}/answer`,
  },
  ai: {
    generateQuestions: '/ai/generate-questions',
    explainConcept: (questionId) => `/ai/explain-concept/${questionId}`,
    evaluateAnswer: '/ai/evaluate-answer',
  },
  analytics: {
    readinessScore: '/analytics/readiness-score',
    knowledgeGaps: '/analytics/knowledge-gaps',
  },
  mistakes: {
    record: '/mistakes/record',
    weakConcepts: '/mistakes/weak-concepts',
    dueForReview: '/mistakes/due-for-review',
    improvementTrends: '/mistakes/improvement-trends',
    checkPreviousStruggle: '/mistakes/check-previous-struggle',
  },
};

export default API_PATHS;
