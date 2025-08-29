import React, { useState } from 'react';
import { Icon } from '@iconify-icon/react';
import { Toast } from './Toast';
import type { Person } from '../types';

interface PersonCardProps {
  person: Person;
  onRemove: (personId: string) => { success: boolean; message: string } | void;
  showRemoveButton?: boolean;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  person,
  onRemove,
  showRemoveButton = true
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleRemoveClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmRemove = () => {
    const result = onRemove(person.id);

    if (result && !result.success) {
      setToastMessage(result.message);
      setShowToast(true);
      setShowConfirm(false);
      return;
    }

    setShowConfirm(false);
  };

  const handleCancelRemove = () => {
    setShowConfirm(false);
  };

  const getAvatarColors = (id: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        {/* 头像 */}
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center text-white font-medium
          ${getAvatarColors(person.id)}
        `}>
          {person.avatar ? (
            <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <span className="text-lg">{person.name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        {/* 姓名和时间 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {person.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(person.createdAt).toLocaleDateString('zh-CN')}
          </p>
        </div>

        {/* 删除按钮 */}
        {showRemoveButton && (
          <div className="relative">
            {!showConfirm ? (
              <button
                onClick={handleRemoveClick}
                className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                title="删除成员"
              >
                <Icon icon="material-symbols:delete-outline" className="text-lg" />
              </button>
            ) : (
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleConfirmRemove}
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors p-1"
                  title="确认删除"
                >
                  <Icon icon="material-symbols:check" className="text-lg" />
                </button>
                <button
                  onClick={handleCancelRemove}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                  title="取消删除"
                >
                  <Icon icon="material-symbols:close" className="text-lg" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast 提示 */}
      <Toast
        message={toastMessage}
        type="error"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};