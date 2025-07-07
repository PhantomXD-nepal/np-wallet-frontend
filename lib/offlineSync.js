// lib/offlineSync.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { API_URL } from "../constants/api";

const OFFLINE_TRANSACTIONS_KEY = "offline_transactions";

/**
 * Save a transaction to local storage for offline use
 * @param {Object} transaction - Transaction data to save
 */
export const saveOfflineTransaction = async (transaction) => {
  try {
    // Get existing offline transactions
    const existingTransactions = await getOfflineTransactions();

    // Add new transaction with a temporary ID
    const transactionWithId = {
      ...transaction,
      offlineId: Date.now().toString(),
      synced: false,
    };

    // Save the updated list
    const updatedTransactions = [...existingTransactions, transactionWithId];
    await AsyncStorage.setItem(
      OFFLINE_TRANSACTIONS_KEY,
      JSON.stringify(updatedTransactions),
    );

    return transactionWithId;
  } catch (error) {
    console.error("Error saving offline transaction:", error);
    throw error;
  }
};

/**
 * Get all offline transactions
 * @returns {Array} Array of offline transactions
 */
export const getOfflineTransactions = async () => {
  try {
    const transactions = await AsyncStorage.getItem(OFFLINE_TRANSACTIONS_KEY);
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error("Error getting offline transactions:", error);
    return [];
  }
};

/**
 * Remove a transaction from offline storage
 * @param {string} offlineId - ID of transaction to remove
 */
export const removeOfflineTransaction = async (offlineId) => {
  try {
    const transactions = await getOfflineTransactions();
    const updatedTransactions = transactions.filter(
      (t) => t.offlineId !== offlineId,
    );

    await AsyncStorage.setItem(
      OFFLINE_TRANSACTIONS_KEY,
      JSON.stringify(updatedTransactions),
    );
  } catch (error) {
    console.error("Error removing offline transaction:", error);
    throw error;
  }
};

/**
 * Sync all offline transactions with the server
 * @returns {Object} Results of sync operation
 */
export const syncOfflineTransactions = async () => {
  // If sync is already in progress, don't start another
  if (isSyncInProgress) {
    console.log("Sync already in progress, skipping...");
    return {
      success: false,
      message: "Sync already in progress",
      isAlreadySyncing: true,
    };
  }

  try {
    // Check for internet connection
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return { success: false, message: "No internet connection" };
    }

    const offlineTransactions = await getOfflineTransactions();
    if (offlineTransactions.length === 0) {
      return {
        success: true,
        message: "No offline transactions to sync",
        count: 0,
      };
    }

    // Filter out only unsynced transactions
    const unsyncedTransactions = offlineTransactions.filter((t) => !t.synced);
    if (unsyncedTransactions.length === 0) {
      return { success: true, message: "No unsynced transactions", count: 0 };
    }

    console.log(`Starting sync of ${unsyncedTransactions.length} transactions`);

    const results = {
      total: offlineTransactions.length,
      successful: 0,
      failed: 0,
      errors: [],
    };

    // Sync each transaction
    for (const transaction of offlineTransactions) {
      try {
        // Skip already synced transactions
        if (transaction.synced) {
          results.successful++;
          continue;
        }

        console.log(`Syncing transaction: ${transaction.title}`);
        const response = await fetch(`${API_URL}/transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: transaction.user_id,
            title: transaction.title,
            amount: transaction.amount,
            category: transaction.category,
          }),
        });

        if (response.ok) {
          // Mark as synced
          transaction.synced = true;
          results.successful++;
          console.log(`Successfully synced: ${transaction.title}`);
        } else {
          const errorData = await response.json();
          results.failed++;
          results.errors.push({
            transaction: transaction.title,
            error: errorData.message || "Unknown error",
          });
          console.log(
            `Failed to sync: ${transaction.title} - ${errorData.message || "Unknown error"}`,
          );
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          transaction: transaction.title,
          error: error.message,
        });
        console.log(
          `Error syncing transaction: ${transaction.title} - ${error.message}`,
        );
      }
    }

    // Calculate the remaining count after sync
    const remainingCount = results.failed;

    // Update offline storage - keep failed transactions
    const remainingTransactions = offlineTransactions.filter((t) => !t.synced);
    await AsyncStorage.setItem(
      OFFLINE_TRANSACTIONS_KEY,
      JSON.stringify(remainingTransactions),
    );

    return {
      success: results.failed === 0,
      message: `Synced ${results.successful} of ${results.total} transactions`,
      results,
      count: remainingCount,
    };
  } catch (error) {
    console.error("Error syncing offline transactions:", error);
    return {
      success: false,
      message: "Failed to sync: " + error.message,
      count: await getUnsyncedTransactionCount(),
    };
  } finally {
    // Release the lock after a short delay to prevent immediate retriggering
    setTimeout(() => {
      isSyncInProgress = false;
      console.log("Sync lock released");
    }, 2000);
  }
};

// Flag to track if a sync is already in progress
let isSyncInProgress = false;

/**
 * Initialize background sync listener
 * This function is kept for backward compatibility but no longer performs automatic syncing
 * Sync must now be triggered manually by the user
 */
export const initOfflineSync = () => {
  // The automatic sync functionality has been removed
  // Sync now only happens when the user manually triggers it
  console.log("Automatic sync disabled - use manual sync only");

  // Return a dummy unsubscribe function for backward compatibility
  return () => {
    console.log("No automatic sync to clean up");
  };
};

/**
 * Get the count of unsynced offline transactions
 * @returns {Promise<number>} Number of unsynced transactions
 */
export const getUnsyncedTransactionCount = async () => {
  const transactions = await getOfflineTransactions();
  return transactions.filter((t) => !t.synced).length;
};
