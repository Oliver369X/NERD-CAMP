import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = 'info',
  onClose,
}) => {
  const variants = {
    initial: { opacity: 0, y: 50, scale: 0.3 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200 text-success-700';
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-700';
      case 'error':
        return 'bg-error-50 border-error-200 text-error-700';
      default:
        return 'bg-primary-50 border-primary-200 text-primary-700';
    }
  };

  return (
    <motion.div
      layout
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg',
        getTypeStyles()
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            {title && (
              <p className="text-sm font-medium">
                {title}
              </p>
            )}
            <p className="text-sm">
              {message}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={() => onClose(id)}
              className="inline-flex rounded-md text-neutral-400 hover:text-neutral-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Toast;