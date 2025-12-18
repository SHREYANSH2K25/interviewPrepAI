const API_PATHS = {
  // Auth endpoints
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
    profile: '/auth/profile',
    uploadImage: '/auth/upload-image',
  },
  // Session endpoints
  sessions: {
    create: '/sessions',
    getAll: '/sessions',
    getById: (id) => `/sessions/${id}`,
    delete: (id) => `/sessions/${id}`,
  },
  // Question endpoints
  questions: {
    add: (sessionId) => `/questions/${sessionId}`,
    pin: (questionId) => `/questions/${questionId}/pin`,
    updateNotes: (questionId) => `/questions/${questionId}/notes`,
  },
  // AI endpoints
  ai: {
    generateQuestions: '/ai/generate-questions',
    explainConcept: (questionId) => `/ai/explain-concept/${questionId}`,
  },
};

export default API_PATHS;
