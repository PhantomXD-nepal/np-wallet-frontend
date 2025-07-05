// react custom hook file

import { useCallback, useState, useRef } from "react";
import { Alert } from "react-native";

const API_URL = "https://np-wallet-backend.onrender.com/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadingRef = useRef(false);

  const loadData = useCallback(async () => {
    if (!userId || loadingRef.current) return;

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const [transResponse, summaryResponse] = await Promise.all([
        fetch(`${API_URL}/transactions/${userId}`),
        fetch(`${API_URL}/transactions/summary/${userId}`),
      ]);

      if (!transResponse.ok || !summaryResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [transData, summaryData] = await Promise.all([
        transResponse.json(),
        summaryResponse.json(),
      ]);

      setTransactions(transData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Error loading data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [userId]);

  const deleteTransaction = useCallback(
    async (id) => {
      if (!userId || loadingRef.current) return;

      try {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete transaction");

        Alert.alert("Success", "Transaction deleted successfully");
        // Schedule loadData for next tick to avoid state update conflicts
        setTimeout(() => loadData(), 0);
      } catch (error) {
        console.error("Error deleting transaction:", error);
        Alert.alert("Error", error.message);
      }
    },
    [userId, loadData],
  );

  return {
    transactions,
    summary,
    isLoading,
    error,
    loadData,
    deleteTransaction,
  };
};
