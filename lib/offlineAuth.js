// lib/offlineAuth.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Keys for storing auth state
const AUTH_USER_KEY = 'fintrack_auth_user';
const AUTH_SESSION_KEY = 'fintrack_auth_session';
const LAST_ONLINE_CHECK_KEY = 'fintrack_last_online_auth';

/**
 * Stores user authentication data locally for offline use
 * @param {Object} user - The user object from Clerk
 * @param {Object} session - The session data
 */
export const saveAuthDataLocally = async (user, session) => {
  try {
    if (!user || !session) {
      console.warn('Invalid auth data provided for offline storage');
      return;
    }

    // Store the user data
    const userData = {
      id: user.id,
      emailAddress: user.emailAddresses?.[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      imageUrl: user.imageUrl || '',
      lastUpdated: new Date().toISOString(),
    };

    // Store session data (expiry, token)
    const sessionData = {
      token: session.token || '',
      expiresAt: session.expiresAt || '',
      lastVerifiedOnline: new Date().toISOString(),
    };

    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData));
    await AsyncStorage.setItem(LAST_ONLINE_CHECK_KEY, new Date().toISOString());

    console.log('Auth data saved locally for offline use');
  } catch (error) {
    console.error('Error saving auth data locally:', error);
  }
};

/**
 * Retrieves locally stored auth data for offline use
 * @returns {Object|null} The user and session data, or null if not found
 */
export const getLocalAuthData = async () => {
  try {
    const userDataString = await AsyncStorage.getItem(AUTH_USER_KEY);
    const sessionDataString = await AsyncStorage.getItem(AUTH_SESSION_KEY);

    if (!userDataString || !sessionDataString) {
      return null;
    }

    const userData = JSON.parse(userDataString);
    const sessionData = JSON.parse(sessionDataString);

    // Check if the session is expired
    const now = new Date();
    const expiresAt = new Date(sessionData.expiresAt);

    if (expiresAt < now) {
      console.warn('Offline session is expired');
      // We still return the data but mark it as expired
      return {
        user: userData,
        session: sessionData,
        isExpired: true
      };
    }

    return {
      user: userData,
      session: sessionData,
      isExpired: false
    };
  } catch (error) {
    console.error('Error retrieving local auth data:', error);
    return null;
  }
};

/**
 * Checks if the device is online and the user's auth is still valid
 * @returns {Promise<boolean>} True if online and valid, false otherwise
 */
export const isOnlineAuthValid = async () => {
  try {
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      return false;
    }

    // Here you would ideally make a lightweight call to the auth server
    // to verify the token is still valid
    // For simplicity, we'll just check if we have valid local data

    const authData = await getLocalAuthData();
    return authData && !authData.isExpired;
  } catch (error) {
    console.error('Error checking online auth status:', error);
    return false;
  }
};

/**
 * Clears the locally stored auth data when the user signs out
 */
export const clearLocalAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([
      AUTH_USER_KEY,
      AUTH_SESSION_KEY,
      LAST_ONLINE_CHECK_KEY
    ]);
    console.log('Local auth data cleared');
  } catch (error) {
    console.error('Error clearing local auth data:', error);
  }
};

/**
 * Updates the timestamp of the last successful online authentication
 */
export const updateLastOnlineCheck = async () => {
  try {
    await AsyncStorage.setItem(LAST_ONLINE_CHECK_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error updating last online check:', error);
  }
};

/**
 * Gets the last time the user was authenticated online
 * @returns {Date|null} The date of last online authentication, or null
 */
export const getLastOnlineCheck = async () => {
  try {
    const timestamp = await AsyncStorage.getItem(LAST_ONLINE_CHECK_KEY);
    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    console.error('Error getting last online check:', error);
    return null;
  }
};

/**
 * Determines if the app should enforce online authentication
 * based on how long it's been since the last online check
 * @param {number} maxDaysOffline - Maximum days to allow offline auth
 * @returns {Promise<boolean>} True if online auth should be enforced
 */
export const shouldEnforceOnlineAuth = async (maxDaysOffline = 7) => {
  try {
    const lastCheck = await getLastOnlineCheck();
    if (!lastCheck) return true;

    const now = new Date();
    const diffTime = Math.abs(now - lastCheck);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > maxDaysOffline;
  } catch (error) {
    console.error('Error checking if online auth should be enforced:', error);
    return true; // Default to requiring online auth if there's an error
  }
};
