import React from 'react';

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};