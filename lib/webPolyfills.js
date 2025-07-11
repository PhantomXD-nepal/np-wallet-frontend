// lib/webPolyfills.js
//
// This file contains polyfills and compatibility fixes for React Native Web
// It should be imported as early as possible in the application

import { Platform } from 'react-native';

// Only apply polyfills when running on web
if (Platform.OS === 'web') {
  // Fix for "Unknown event handler property" warnings in React Native Web
  if (typeof document !== 'undefined' && document.addEventListener) {
    const originalAddEventListener = document.addEventListener;
    document.addEventListener = (type, listener, options) => {
      // Suppress certain React Native specific events that aren't applicable on web
      if (type && (
        type.startsWith('onResponder') ||
        type === 'onStartShouldSetResponder' ||
        type === 'onMoveShouldSetResponder' ||
        type === 'onPressOut'
      )) {
        return;
      }
      return originalAddEventListener.call(document, type, listener, options);
    };
  }

  // Add global variables needed by some React Native components
  if (typeof global !== 'undefined') {
    // Ensure _frameTimestamp exists for animations
    if (!global._frameTimestamp) {
      global._frameTimestamp = 0;
    }

    // Provide a fallback for requestAnimationFrame and cancelAnimationFrame
    if (!global.requestAnimationFrame) {
      global.requestAnimationFrame = callback => {
        const timestamp = Date.now();
        global._frameTimestamp = timestamp;
        return setTimeout(() => callback(timestamp), 1000 / 60);
      };
    }

    if (!global.cancelAnimationFrame) {
      global.cancelAnimationFrame = id => clearTimeout(id);
    }
  }

  // Suppress common warning messages for cleaner development experience
  if (console.warn) {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0] && typeof args[0] === 'string') {
        // Skip specific known warnings
        if (
          args[0].includes('Unknown event handler property') ||
          args[0].includes('Unknown prop') ||
          args[0].includes('is deprecated') ||
          args[0].includes('is not supported on web')
        ) {
          return;
        }
      }
      return originalWarn.apply(console, args);
    };
  }
}

export default {
  name: 'webPolyfills',
  enabled: Platform.OS === 'web'
};
