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
        className="fixed inset-0 transition-opacity duration-300 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        onClick={onClose}
      />

      {/* 模态框容器 */}
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        {/* 模态框内容 */}
        <div className={`
          relative bg-white rounded-xl shadow-2xl transform transition-all duration-300 w-full max-h-[90vh] overflow-hidden
          ${sizeClasses[size]}
        `}>
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 p-2 rounded-lg border border-transparent hover:border-gray-200"
              title="关闭"
            >
              <Icon icon="material-symbols:close" className="w-5 h-5" />
            </button>
          </div>

          {/* 内容区域 */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};