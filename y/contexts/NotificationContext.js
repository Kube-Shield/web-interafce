'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const initSocket = async () => {
      try {
        // First, initialize the socket server
        console.log('Initializing socket connection...');
        await fetch('/api/socket');
        
        // Then connect to it
        const newSocket = io({
          path: '/api/socket'
        });
        
        newSocket.on('connect', () => {
          console.log('✅ Connected to socket server, ID:', newSocket.id);
          setIsConnected(true);
          if (session?.user?.email) {
            console.log('Joining room for user:', session.user.email);
            newSocket.emit('join-room', session.user.email);
          }
        });

        newSocket.on('disconnect', () => {
          console.log('❌ Disconnected from socket server');
          setIsConnected(false);
        });

        newSocket.on('notification', (notification) => {
          console.log('📝 Received notification:', notification);
          setNotifications(prev => [notification, ...prev].slice(0, 50));
          
          // Show browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico',
              badge: '/favicon.ico'
            });
          }
        });

        newSocket.on('global-alert', (alert) => {
          console.log('🚨 Received global alert:', alert);
          setAlerts(prev => [alert, ...prev].slice(0, 10));
          
          // Show browser notification for high severity
          if (alert.severity >= 6 && Notification.permission === 'granted') {
            console.log('Showing browser notification for alert');
            new Notification(`🚨 ${alert.title}`, {
              body: alert.description,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              requireInteraction: alert.severity >= 8
            });
          }
        });

        // Test connection
        newSocket.on('connect', () => {
          console.log('Testing socket with ping...');
          newSocket.emit('ping', 'test');
        });

        setSocket(newSocket);

        return () => {
          console.log('Cleaning up socket connection');
          newSocket.close();
        };
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    if (session) {
      initSocket();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [session]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      console.log('Requesting notification permission...');
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  const clearNotifications = () => setNotifications([]);
  const clearAlerts = () => setAlerts([]);
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      socket,
      notifications,
      alerts,
      isConnected,
      clearNotifications,
      clearAlerts,
      removeNotification,
      removeAlert
    }}>
      {children}
    </NotificationContext.Provider>
  );
};