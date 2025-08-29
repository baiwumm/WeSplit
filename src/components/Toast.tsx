import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify-icon/react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  show,
  onClose,
  duration = 3000
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // 等待动画完成
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show && !isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 max-w-sm";

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border border-yellow-200 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border border-gray-200 text-gray-800`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'material-symbols:check-circle';
      case 'error':
        return 'material-symbols:error';
      case 'warning':
        return 'material-symbols:warning';
      case 'info':
        return 'material-symbols:info';
      default:
        return 'material-symbols:info';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div
      className={`${getToastStyles()} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <Icon
        icon={getIcon()}
        className={`text-lg ${getIconColor()} mr-3 flex-shrink-0`}
      />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Icon icon="material-symbols:close" className="text-sm" />
      </button>
    </div>
  );
};