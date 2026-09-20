/**
 * A lightweight wrapper around localStorage to safely parse/stringify JSON.
 */
export const storage = {
  getToken: () => {
    try {
      return localStorage.getItem('token');
    } catch (e) {
      return null;
    }
  },
  
  setToken: (token) => {
    try {
      localStorage.setItem('token', token);
    } catch (e) {
      console.error('Failed to save auth token');
    }
  },
  
  clearToken: () => {
    try {
      localStorage.removeItem('token');
    } catch (e) {
      console.error('Failed to clear auth token');
    }
  },

  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save ${key} to local storage`);
    }
  }
};