import React, { createContext, useEffect, useState } from 'react';
// import { io } from 'socket.io-client'; 
// (Uncomment above and npm install socket.io-client when backend is ready)

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    /* 
    // Uncomment when connecting to actual Node.js WebSocket server
    const newSocket = io(import.meta.env.VITE_WS_URL || 'http://localhost:5000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    
    setSocket(newSocket);

    return () => newSocket.close();
    */
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};