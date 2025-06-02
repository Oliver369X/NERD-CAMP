import React from 'react';
import { Bell, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../../stores/notificationStore';
import Button from '../ui/Button';

const NotificationDropdown: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => markAllAsRead()}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Notificaciones</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAllAsRead()}
                  >
                    Marcar todas como leídas
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {notifications.map(notification => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-3 rounded-lg ${
                      notification.read ? 'bg-neutral-50' : 'bg-primary-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`text-sm ${notification.read ? 'text-neutral-600' : 'text-neutral-900'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(notification.timestamp).toLocaleDateString('es-BO', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-primary-600 hover:text-primary-700 p-1"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-neutral-400 hover:text-neutral-500 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {notifications.length === 0 && (
                <p className="text-center text-neutral-500 py-4">
                  No hay notificaciones
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;