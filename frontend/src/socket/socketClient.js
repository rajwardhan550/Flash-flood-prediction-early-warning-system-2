import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

// Initialize the socket instance but prevent auto-connection 
// so we can attach authentication tokens first if needed.
export const socket = io(SOCKET_URL, {
  autoConnect: false, 
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
});

/**
 * Connects the socket to the backend, optionally attaching a JWT for protected namespaces.
 * @param {string} token - Optional authentication token
 */
export const connectSocket = (token = null) => {
  if (token) {
    socket.auth = { token };
  }
  
  if (!socket.connected) {
    socket.connect();
  }
};

/**
 * Disconnects the socket gracefully.
 */
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};