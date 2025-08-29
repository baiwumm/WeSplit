import React from 'react';

interface InputProps {
  label?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
        `}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};