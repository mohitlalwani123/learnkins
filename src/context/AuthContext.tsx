import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  grade?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAIL'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Try to parse saved user first
          const user = JSON.parse(savedUser);
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, token }
          });
          
          // Verify token with backend
          try {
            const response = await authAPI.getMe();
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: response.data.user,
                token
              }
            });
          } catch (verifyError) {
            console.warn('Token verification failed, but using cached user data');
          }
        } catch (parseError) {
          console.error('Failed to parse saved user data:', parseError);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'AUTH_FAIL', payload: null });
        }
      } else {
        dispatch({ type: 'AUTH_FAIL', payload: null });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: { email: string; password: string }) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      console.log('Attempting login with:', credentials.email);
      
      const response = await authAPI.login(credentials);
      
      console.log('Login response:', response.data);
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
      
      console.log('Login successful for user:', user.email);
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      
      let message = 'Login failed. Please try again.';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (userData: any) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      console.log('Attempting registration for:', userData.email);
      
      const response = await authAPI.register(userData);
      
      console.log('Registration response:', response.data);
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
      
      console.log('Registration successful for user:', user.email);
      
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let message = 'Registration failed. Please try again.';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      console.log('User logged out successfully');
    }
  };

  // Update profile function
  const updateProfile = async (data: any) => {
    try {
      const response = await authAPI.updateProfile(data);
      
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      dispatch({
        type: 'UPDATE_USER',
        payload: updatedUser
      });
      
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Update failed';
      return { success: false, error: message };
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;