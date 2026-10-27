import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 'system' | 'light' | 'dark'
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('app_theme_mode') || 'light';
  });

  const [systemIsDark, setSystemIsDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Resolved value
  const isDark = themeMode === 'system' ? systemIsDark : themeMode === 'dark';
  const activeTheme = isDark ? 'dark' : 'light';

  // Apply data-theme to HTML tag for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  // 1-Click 3-Way Cycle: system -> light -> dark -> system
  const cycleTheme = () => {
    setThemeMode((prev) => {
      let next = 'system';
      if (prev === 'system') next = 'light';
      else if (prev === 'light') next = 'dark';
      else if (prev === 'dark') next = 'system';
      localStorage.setItem('app_theme_mode', next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, isDark, activeTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}