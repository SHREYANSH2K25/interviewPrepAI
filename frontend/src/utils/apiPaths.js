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
  
  // AI endpoints
  GENERATE_QUESTIONS: '/ai/generate-questions',
  EXPLAIN_CONCEPT: (questionId) => `/ai/explain-concept/${questionId}`,
  
  // Profile endpoints
  PROFILE_STATS: '/profile/stats',
  
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
  },
  ai: {
    generateQuestions: '/ai/generate-questions',
    explainConcept: (questionId) => `/ai/explain-concept/${questionId}`,
  },
};

export default API_PATHS;
