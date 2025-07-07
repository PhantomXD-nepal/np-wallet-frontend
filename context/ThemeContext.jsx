import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Theme colors
export const themeColors = {
  [THEMES.LIGHT]: {
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#000000',
    subText: '#666666',
    primary: '#007AFF',
    income: '#34C759',
    expense: '#FF3B30',
    border: '#E5E5E5',
    buttonBackground: '#007AFF',
    buttonText: '#FFFFFF',
    inputBackground: '#F5F5F5',
  },
  [THEMES.DARK]: {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    subText: '#AAAAAA',
    primary: '#0A84FF',
    income: '#30D158',
    expense: '#FF453A',
    border: '#333333',
    buttonBackground: '#0A84FF',
    buttonText: '#FFFFFF',
    inputBackground: '#2C2C2C',
  },
};

// Create context
const ThemeContext = createContext();

// Storage key
const THEME_STORAGE_KEY = 'fintrack_theme_preference';

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState(deviceTheme || THEMES.LIGHT);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme from AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          // Use device theme as default if no saved preference
          setTheme(deviceTheme || THEMES.LIGHT);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [deviceTheme]);

  // Save theme preference to AsyncStorage
  const saveThemePreference = async (newTheme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
    saveThemePreference(newTheme);
  };

  // Get current theme colors
  const colors = themeColors[theme];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        toggleTheme,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
