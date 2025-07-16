import axios, { AxiosResponse } from 'axios';

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData: any): Promise<AxiosResponse> => {
    console.log('Registering user:', userData);
    return api.post('/auth/register', userData);
  },
  
  login: (credentials: any): Promise<AxiosResponse> => {
    console.log('Logging in user:', credentials.email);
    return api.post('/auth/login', credentials);
  },
  
  logout: (): Promise<AxiosResponse> => {
    return api.post('/auth/logout');
  },
  
  getMe: (): Promise<AxiosResponse> => {
    return api.get('/auth/me');
  },
  
  updateProfile: (data: any): Promise<AxiosResponse> => {
    return api.put('/auth/profile', data);
  },
  
  changePassword: (data: any): Promise<AxiosResponse> => {
    return api.put('/auth/change-password', data);
  },
  
  forgotPassword: (email: string): Promise<AxiosResponse> => {
    return api.post('/auth/forgot-password', { email });
  },
  
  resetPassword: (token: string, password: string): Promise<AxiosResponse> => {
    return api.put(`/auth/reset-password/${token}`, { password });
  }
};

// Users API calls
export const usersAPI = {
  getAll: (params?: any): Promise<AxiosResponse> => api.get('/users', { params }),
  getById: (id: string): Promise<AxiosResponse> => api.get(`/users/${id}`),
  update: (id: string, data: any): Promise<AxiosResponse> => api.put(`/users/${id}`, data),
  delete: (id: string): Promise<AxiosResponse> => api.delete(`/users/${id}`),
  getProgress: (id: string): Promise<AxiosResponse> => api.get(`/users/${id}/progress`),
  getAchievements: (id: string): Promise<AxiosResponse> => api.get(`/users/${id}/achievements`)
};

// Subjects API calls
export const subjectsAPI = {
  getAll: (grade?: string): Promise<AxiosResponse> => api.get(`/subjects${grade ? `?grade=${grade}` : ''}`),
  getBySlug: (slug: string): Promise<AxiosResponse> => api.get(`/subjects/${slug}`),
  getChapters: (slug: string): Promise<AxiosResponse> => api.get(`/subjects/${slug}/chapters`),
  create: (data: any): Promise<AxiosResponse> => api.post('/subjects', data),
  update: (id: string, data: any): Promise<AxiosResponse> => api.put(`/subjects/${id}`, data),
  delete: (id: string): Promise<AxiosResponse> => api.delete(`/subjects/${id}`)
};

// Materials API calls
export const materialsAPI = {
  getAll: (params?: any): Promise<AxiosResponse> => api.get('/materials', { params }),
  getById: (id: string): Promise<AxiosResponse> => api.get(`/materials/${id}`),
  search: (query: string): Promise<AxiosResponse> => api.get(`/materials/search?q=${query}`),
  download: (id: string): Promise<AxiosResponse> => api.get(`/materials/${id}/download`),
  create: (formData: FormData): Promise<AxiosResponse> => api.post('/materials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: string, data: any): Promise<AxiosResponse> => api.put(`/materials/${id}`, data),
  delete: (id: string): Promise<AxiosResponse> => api.delete(`/materials/${id}`)
};

// Quizzes API calls
export const quizzesAPI = {
  getAll: (params?: any): Promise<AxiosResponse> => api.get('/quizzes', { params }),
  getById: (id: string): Promise<AxiosResponse> => api.get(`/quizzes/${id}`),
  submit: (id: string, answers: any[], timeTaken: number): Promise<AxiosResponse> => api.post(`/quizzes/${id}/submit`, { answers, timeTaken }),
  getResults: (id: string): Promise<AxiosResponse> => api.get(`/quizzes/${id}/results`),
  getStatistics: (id: string): Promise<AxiosResponse> => api.get(`/quizzes/${id}/statistics`),
  create: (data: any): Promise<AxiosResponse> => api.post('/quizzes', data),
  update: (id: string, data: any): Promise<AxiosResponse> => api.put(`/quizzes/${id}`, data),
  delete: (id: string): Promise<AxiosResponse> => api.delete(`/quizzes/${id}`)
};

// Games API calls
export const gamesAPI = {
  getAll: (params?: any): Promise<AxiosResponse> => api.get('/games', { params }),
  getById: (id: string): Promise<AxiosResponse> => api.get(`/games/${id}`),
  play: (id: string): Promise<AxiosResponse> => api.post(`/games/${id}/play`),
  submitScore: (id: string, score: number, timeTaken: number): Promise<AxiosResponse> => api.post(`/games/${id}/score`, { score, timeTaken }),
  getLeaderboard: (id: string): Promise<AxiosResponse> => api.get(`/games/${id}/leaderboard`),
  create: (data: any): Promise<AxiosResponse> => api.post('/games', data),
  update: (id: string, data: any): Promise<AxiosResponse> => api.put(`/games/${id}`, data),
  delete: (id: string): Promise<AxiosResponse> => api.delete(`/games/${id}`)
};

// Community API calls
export const communityAPI = {
  // Discussions
  getDiscussions: (params?: any): Promise<AxiosResponse> => api.get('/community/discussions', { params }),
  getDiscussion: (id: string): Promise<AxiosResponse> => api.get(`/community/discussions/${id}`),
  createDiscussion: (data: any): Promise<AxiosResponse> => api.post('/community/discussions', data),
  updateDiscussion: (id: string, data: any): Promise<AxiosResponse> => api.put(`/community/discussions/${id}`, data),
  deleteDiscussion: (id: string): Promise<AxiosResponse> => api.delete(`/community/discussions/${id}`),
  addReply: (id: string, content: string): Promise<AxiosResponse> => api.post(`/community/discussions/${id}/reply`, { content }),
  likeDiscussion: (id: string): Promise<AxiosResponse> => api.post(`/community/discussions/${id}/like`),
  
  // Study Groups
  getStudyGroups: (params?: any): Promise<AxiosResponse> => api.get('/community/study-groups', { params }),
  createStudyGroup: (data: any): Promise<AxiosResponse> => api.post('/community/study-groups', data),
  joinStudyGroup: (id: string): Promise<AxiosResponse> => api.post(`/community/study-groups/${id}/join`),
  leaveStudyGroup: (id: string): Promise<AxiosResponse> => api.post(`/community/study-groups/${id}/leave`),
  
  // Achievements
  getAchievements: (): Promise<AxiosResponse> => api.get('/community/achievements'),
  getUserAchievements: (): Promise<AxiosResponse> => api.get('/community/achievements/user')
};

// Progress API calls
export const progressAPI = {
  getProgress: (): Promise<AxiosResponse> => api.get('/progress'),
  getStats: (): Promise<AxiosResponse> => api.get('/progress/stats'),
  getSubjectProgress: (subject: string): Promise<AxiosResponse> => api.get(`/progress/subject/${subject}`),
  updateProgress: (data: any): Promise<AxiosResponse> => api.put('/progress/update', data),
  logSession: (data: any): Promise<AxiosResponse> => api.post('/progress/session', data)
};

// Parental Control API calls
export const parentalAPI = {
  getControls: (childId: string): Promise<AxiosResponse> => api.get(`/parental/${childId}`),
  updateControls: (childId: string, data: any): Promise<AxiosResponse> => api.put(`/parental/${childId}`, data),
  getChildProgress: (childId: string): Promise<AxiosResponse> => api.get(`/parental/${childId}/progress`),
  getChildActivity: (childId: string): Promise<AxiosResponse> => api.get(`/parental/${childId}/activity`),
  setTimeControls: (childId: string, data: any): Promise<AxiosResponse> => api.put(`/parental/${childId}/time-controls`, data),
  setContentFilters: (childId: string, data: any): Promise<AxiosResponse> => api.put(`/parental/${childId}/content-filters`, data),
  getSessionLogs: (childId: string): Promise<AxiosResponse> => api.get(`/parental/${childId}/session-logs`)
};

// Contact API calls
export const contactAPI = {
  submit: (data: any): Promise<AxiosResponse> => api.post('/contact', data),
  getMessages: (): Promise<AxiosResponse> => api.get('/contact'),
  updateStatus: (id: string, status: string): Promise<AxiosResponse> => api.put(`/contact/${id}/status`, { status })
};

// Flashcards API calls
export const flashcardsAPI = {
  getAll: (params?: any): Promise<AxiosResponse> => api.get('/flashcards', { params }),
  getById: (id: string): Promise<AxiosResponse> => api.get(`/flashcards/${id}`),
  getMy: (params?: any): Promise<AxiosResponse> => api.get('/flashcards/my/flashcards', { params }),
  getPopular: (limit?: number): Promise<AxiosResponse> => api.get(`/flashcards/popular?limit=${limit}`),
  getRecent: (limit?: number): Promise<AxiosResponse> => api.get(`/flashcards/recent?limit=${limit}`),
  search: (params?: any): Promise<AxiosResponse> => api.get('/flashcards/search', { params }),
  create: (data: any): Promise<AxiosResponse> => api.post('/flashcards', data),
  update: (id: string, data: any): Promise<AxiosResponse> => api.put(`/flashcards/${id}`, data),
  delete: (id: string): Promise<AxiosResponse> => api.delete(`/flashcards/${id}`),
  study: (id: string, difficulty: string): Promise<AxiosResponse> => api.post(`/flashcards/${id}/study`, { difficulty }),
  rate: (id: string, rating: number): Promise<AxiosResponse> => api.post(`/flashcards/${id}/rate`, { rating })
};

export default api;