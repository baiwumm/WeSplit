import React from 'react';
import { Icon } from '@iconify-icon/react';
import { useTheme } from '../hooks/useTheme';
import { Button } from './Button';

export const ThemeToggle: React.FC = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return 'material-symbols:light-mode';
      case 'dark':
        return 'material-symbols:dark-mode';
      case 'system':
        return 'material-symbols:computer';
      default:
        return 'material-symbols:light-mode';
    }
  };

  const getTooltip = () => {
    // 显示点击后要切换到的状态，而不是当前状态
    switch (theme) {
      case 'light':
        return '深色模式';
      case 'dark':
        return '跟随系统';
      case 'system':
        return '浅色模式';
      default:
        return '切换主题';
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="relative group"
      title={getTooltip()}
    >
      <Icon
        icon={getIcon()}
        className={`text-lg transition-transform duration-300 ${isDarkMode ? 'rotate-180' : 'rotate-0'
          }`}
      />

      {/* 工具提示 */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {getTooltip()}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
      </div>
    </Button>
  );
};