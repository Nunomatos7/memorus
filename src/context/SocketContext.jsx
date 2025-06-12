// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user || !token) {
      console.log('No user or token, skipping socket connection');
      return;
    }

    console.log('Initializing socket connection...');
    
    // Get the base URL for the socket connection
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const port = process.env.NODE_ENV === 'development' ? ':3000' : '';
    const socketUrl = `${protocol}//${host}${port}`;

    // Create socket connection with authentication
    const newSocket = io(socketUrl, {
      auth: {
        token: token,
        tenant: user.tenant_subdomain || user.tenant
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setConnected(false);
    });

    // Notification event handlers
    newSocket.on('notification:new', (notification) => {
      console.log('New notification received:', notification);
      
      // Add to local notifications state
      setNotifications(prev => [notification, ...prev]);
      
      // Show toast notification
      const toastOptions = {
        duration: 5000,
        style: {
          background: '#1E1F20',
          color: '#fff',
          border: '1px solid #d0bcfe',
        }
      };

      // Different toast types based on notification type
      switch (notification.type) {
        case 'new_memor':
          toast(
            <div>
              <strong>{notification.title}</strong>
              <br />
              <span style={{ fontSize: '0.9em' }}>{notification.description}</span>
            </div>,
            {
              ...toastOptions,
              icon: '🎯'
            }
          );
          break;
          
        case 'due_soon':
          toast.error(
            <div>
              <strong>{notification.title}</strong>
              <br />
              <span style={{ fontSize: '0.9em' }}>{notification.description}</span>
            </div>,
            {
              ...toastOptions,
              icon: '⏰'
            }
          );
          break;
          
        case 'memor_completed':
          toast.success(
            <div>
              <strong>{notification.title}</strong>
              <br />
              <span style={{ fontSize: '0.9em' }}>{notification.description}</span>
            </div>,
            {
              ...toastOptions,
              icon: '✅'
            }
          );
          break;
          
        default:
          toast(
            <div>
              <strong>{notification.title}</strong>
              <br />
              <span style={{ fontSize: '0.9em' }}>{notification.description}</span>
            </div>,
            toastOptions
          );
      }
      
      // Play notification sound if enabled
      playNotificationSound();
      
      // Update browser notification count if supported
      if ('setAppBadge' in navigator && 'clearAppBadge' in navigator) {
        navigator.setAppBadge(notifications.filter(n => !n.read).length + 1);
      }
    });

    newSocket.on('notification:read', (data) => {
      console.log('Notification marked as read:', data);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === data.id ? { ...notif, read: true } : notif
        )
      );
    });

    newSocket.on('notification:deleted', (data) => {
      console.log('Notification deleted:', data);
      setNotifications(prev => prev.filter(notif => notif.id !== data.id));
    });

    // Memor events
    newSocket.on('memor:created', (memor) => {
      console.log('New memor created:', memor);
      
      // You can emit custom events or update state as needed
      window.dispatchEvent(new CustomEvent('memor:created', { detail: memor }));
      
      toast(
        <div>
          <strong>New Memor Available!</strong>
          <br />
          <span style={{ fontSize: '0.9em' }}>{memor.title} - {memor.points} points</span>
        </div>,
        {
          duration: 5000,
          icon: '🆕',
          style: {
            background: '#1E1F20',
            color: '#fff',
            border: '1px solid #d0bcfe',
          }
        }
      );
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up socket connection');
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [user, token]);

  // Function to play notification sound
  const playNotificationSound = () => {
    try {
      // Check if user has granted permission and sound is enabled
      const soundEnabled = localStorage.getItem('notificationSound') !== 'false';
      
      if (soundEnabled) {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Could not play notification sound:', e));
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  // Function to acknowledge a notification
  const acknowledgeNotification = (notificationId) => {
    if (socket && socket.connected) {
      socket.emit('notification:acknowledge', notificationId);
    }
  };

  // Function to request browser notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  // Enable browser notifications for important events
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      // Listen for due soon notifications to show browser notifications
      const handleDueSoon = (event) => {
        const notification = event.detail;
        if (notification.type === 'due_soon') {
          new Notification('Memor Due Soon! ⏰', {
            body: notification.description,
            icon: '/logo192.png',
            tag: `memor-${notification.memorId}`,
            requireInteraction: true
          });
        }
      };

      window.addEventListener('notification:due_soon', handleDueSoon);

      return () => {
        window.removeEventListener('notification:due_soon', handleDueSoon);
      };
    }
  }, []);

  const contextValue = {
    socket,
    connected,
    notifications,
    acknowledgeNotification,
    requestNotificationPermission,
    setNotifications
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};