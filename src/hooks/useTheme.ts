import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'wesplit-theme';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    return savedTheme || 'system';
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  // 获取系统主题偏好
  const getSystemTheme = (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // 应用主题到DOM
  const applyTheme = (currentTheme: Theme) => {
    const root = document.documentElement;
    
    let shouldBeDark = false;
    
    if (currentTheme === 'dark') {
      shouldBeDark = true;
    } else if (currentTheme === 'system') {
      shouldBeDark = getSystemTheme();
    }

    if (shouldBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    setIsDarkMode(shouldBeDark);
  };

  // 切换主题
  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  };

  // 设置特定主题
  const setThemeMode = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  };

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // 初始应用主题
    applyTheme(theme);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  return {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme: setThemeMode
  };
};