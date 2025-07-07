// hooks/useTheme.js
import { useState, useEffect, useCallback } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  THEMES,
  themeNames,
  cycleTheme,
  getStoredTheme,
  setCurrentTheme,
} from "../constants/colors";

const THEME_STORAGE_KEY = "fintrack_theme";

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState("forest"); // Default theme
  const [themeColors, setThemeColors] = useState(THEMES.forest);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from storage on initial mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const themeName = savedTheme || "forest"; // Default to forest if no theme is saved

        if (themeNames.includes(themeName)) {
          setCurrentTheme(themeName);
          setThemeColors(THEMES[themeName]);
        } else {
          // Fallback to forest if saved theme is invalid
          setCurrentTheme("forest");
          setThemeColors(THEMES.forest);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
        // Fallback to forest on error
        setCurrentTheme("forest");
        setThemeColors(THEMES.forest);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Save theme to storage
  const saveThemeToStorage = async (themeName) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeName);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  // Toggle to next theme in the cycle
  const toggleTheme = useCallback(async () => {
    const currentIndex = themeNames.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    const nextTheme = themeNames[nextIndex];

    setCurrentTheme(nextTheme);
    setThemeColors(THEMES[nextTheme]);
    await saveThemeToStorage(nextTheme);

    return nextTheme;
  }, [currentTheme]);

  // Set a specific theme
  const setTheme = useCallback(async (themeName) => {
    if (themeNames.includes(themeName)) {
      setCurrentTheme(themeName);
      setThemeColors(THEMES[themeName]);
      await saveThemeToStorage(themeName);
      return true;
    }
    return false;
  }, []);

  return {
    currentTheme,
    colors: themeColors,
    toggleTheme,
    setTheme,
    isLoading,
    availableThemes: themeNames,
  };
};
