import React, { createContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Use environment variable for WebSocket URL, fallback to localhost for development
    const wsUrl = process.env.REACT_APP_WS_URL || 'http://localhost:5000';
    
    console.log('Initializing WebSocket connection to:', wsUrl);
    
    // Create socket connection
    const ws = io(wsUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000
    });

    // Connection established
    ws.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setSocket(ws);
    });

    // Connection error
    ws.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Disconnected
    ws.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
      
      // Attempt to reconnect if not explicitly disconnected
      if (reason !== 'io client disconnect') {
        console.log('Attempting to reconnect...');
      }
    });

    // Reconnection attempt
    ws.on('reconnect_attempt', (attempt) => {
      console.log(`WebSocket reconnection attempt ${attempt}`);
    });

    // Reconnection failed
    ws.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed');
      setIsConnected(false);
    });

    // Store socket reference
    socketRef.current = ws;

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up WebSocket connection');
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const socket = React.useContext(WebSocketContext);
  if (!socket) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return socket;
};
