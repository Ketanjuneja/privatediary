import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    primaryLight: string;
    text: string;
    textSecondary: string;
    border: string;
    card: string;
    shadow: string;
  };
  isDark: boolean;
}

const lightTheme: Theme = {
  colors: {
    background: '#f8f9fa',
    surface: '#ffffff',
    primary: '#7c5dfa',
    primaryLight: '#9575ff',
    text: '#1a1a1a',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    card: '#ffffff',
    shadow: '#00000020',
  },
  isDark: false,
};

const darkTheme: Theme = {
  colors: {
    background: '#121212',
    surface: '#1e1e1e',
    primary: '#8b7af0',
    primaryLight: '#a594f0',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#2d2d2d',
    card: '#1e1e1e',
    shadow: '#ffffff10',
  },
  isDark: true,
};

const ThemeContext = createContext<Theme>(lightTheme);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(
    systemColorScheme === 'dark' ? darkTheme : lightTheme
  );

  useEffect(() => {
    setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
  }, [systemColorScheme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};