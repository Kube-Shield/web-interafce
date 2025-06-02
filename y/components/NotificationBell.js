'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, Info, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/contexts/NotificationContext';

export default function NotificationBell() {
  const { notifications, alerts, removeNotification, removeAlert, clearNotifications, clearAlerts, isConnected } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState(null);
  const buttonRef = useRef(null);

  const totalCount = notifications.length + alerts.length;

  // Calculate button position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonRect(rect);
    }
  }, [isOpen]);

  const getSeverityColor = (severity) => {
    if (severity >= 8) return 'text-red-400 bg-red-500/20 border-red-500/30';
    if (severity >= 6) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    if (severity >= 4) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
  };

  const getSeverityIcon = (severity) => {
    if (severity >= 8) return AlertTriangle;
    if (severity >= 6) return AlertTriangle;
    if (severity >= 4) return Info;
    return CheckCircle;
  };

  const NotificationPanel = () => (
    <AnimatePresence>
      {isOpen && buttonRect && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed z-50 w-96 max-h-96 overflow-hidden"
            style={{
              top: buttonRect.bottom + 8,
              right: window.innerWidth - buttonRect.right,
            }}
          >
            <Card className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-purple-500/30 backdrop-blur-xl shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-white text-lg">Notifications</CardTitle>
                    <div className="flex items-center space-x-1">
                      {isConnected ? (
                        <Wifi className="w-4 h-4 text-green-400" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                        {isConnected ? 'Live' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {totalCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          clearNotifications();
                          clearAlerts();
                        }}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        Clear All
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="max-h-80 overflow-y-auto">
                  {totalCount === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No notifications</p>
                      {!isConnected && (
                        <p className="text-xs text-red-400 mt-2">
                          Connection lost - trying to reconnect...
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {/* High Priority Alerts */}
                      {alerts.map((alert) => {
                        const IconComponent = getSeverityIcon(alert.severity);
                        return (
                          <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors group"
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-1 rounded ${getSeverityColor(alert.severity)}`}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-white font-medium text-sm truncate">
                                    {alert.title}
                                  </p>
                                  <Badge className={getSeverityColor(alert.severity)}>
                                    {alert.severity}
                                  </Badge>
                                </div>
                                <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                                  {alert.description}
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                  {new Date(alert.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAlert(alert.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Regular Notifications */}
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="p-1 rounded bg-blue-500/20 text-blue-400">
                              <Info className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm">
                                {notification.title}
                              </p>
                              <p className="text-gray-400 text-xs mt-1">
                                {notification.message}
                              </p>
                              <p className="text-gray-500 text-xs mt-1">
                                {new Date(notification.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeNotification(notification.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-300 hover:text-white hover:bg-white/10"
      >
        <div className="relative">
          <Bell className="w-5 h-5" />
          {/* Connection status indicator */}
          <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-400' : 'bg-red-400'
          }`} />
        </div>
        {totalCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">
              {totalCount > 99 ? '99+' : totalCount}
            </span>
          </motion.div>
        )}
      </Button>

      {/* Render notification panel in portal */}
      {typeof window !== 'undefined' && createPortal(<NotificationPanel />, document.body)}
    </>
  );
}