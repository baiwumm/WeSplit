import React from 'react';
import { Icon } from '@iconify-icon/react';

interface CheckboxGroupProps {
  label?: string;
  options: Array<{ value: string; label: string; avatar?: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
  required?: boolean;
  error?: string;
  className?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selected,
  onChange,
  required = false,
  error,
  className = ''
}) => {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map(option => option.value));
    }
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
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {options.length > 1 && (
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selected.length === options.length ? '取消全选' : '全选'}
            </button>
          )}
        </div>
      )}

      <div className="space-y-2">
        {options.map(option => (
          <label
            key={option.value}
            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />

            {/* 头像 */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
              ${getAvatarColors(option.value)}
            `}>
              {option.avatar ? (
                <img src={option.avatar} alt={option.label} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <span>{option.label.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <span className="text-sm font-medium text-gray-900 flex-1">
              {option.label}
            </span>

            {selected.includes(option.value) && (
              <Icon icon="material-symbols:check" className="text-lg text-blue-600" />
            )}
          </label>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {selected.length > 0 && (
        <p className="text-sm text-gray-600">
          已选择 {selected.length} 人
        </p>
      )}
    </div>
  );
};