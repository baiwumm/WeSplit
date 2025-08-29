import React from 'react';
import { Icon } from '@iconify-icon/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 transition-opacity duration-300 backdrop-blur-sm bg-black/10 dark:bg-black/40"
        onClick={onClose}
      />

      {/* 模态框容器 */}
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        {/* 模态框内容 */}
        <div className={`
          relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all duration-300 w-full max-h-[90vh] overflow-hidden
          ${sizeClasses[size]}
        `}>
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-200 p-2 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
              title="关闭"
            >
              <Icon icon="material-symbols:close" className="text-lg" />
            </button>
          </div>

          {/* 内容区域 */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-white dark:bg-gray-800">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};