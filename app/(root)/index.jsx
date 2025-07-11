import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SignOutButton } from "../../components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect, useState } from "react";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import { getUnsyncedTransactionCount } from "../../lib/offlineSync";
import NoTransactionsFound from "../../components/NoTransactionsFound";
import { COLORS } from "../../constants/colors";
import { showModal } from "../../components/extras/customModal";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState("All");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filteredSummary, setFilteredSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [availableDates, setAvailableDates] = useState(["All"]);

  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransactions(user.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Extract unique dates from transactions and format them
  useEffect(() => {
    if (transactions.length > 0) {
      // Extract and format unique dates
      const dateSet = new Set();
      dateSet.add("All"); // Always include "All" option

      transactions.forEach((item) => {
        const date = new Date(item.created_at);
        const formattedDate = `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}`;
        dateSet.add(formattedDate);
      });

      setAvailableDates(Array.from(dateSet));
    }
  }, [transactions]);

  // Filter transactions based on selected date
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setFilteredTransactions([]);
      setFilteredSummary({ balance: 0, income: 0, expenses: 0 });
      return;
    }

    if (selectedDate === "All") {
      setFilteredTransactions(transactions);
      setFilteredSummary(summary);
    } else {
      const filtered = transactions.filter((item) => {
        const date = new Date(item.created_at);
        const formattedDate = `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}`;
        return formattedDate === selectedDate;
      });

      setFilteredTransactions(filtered);

      // Calculate summary for filtered transactions
      const filteredBalance = filtered.reduce(
        (sum, item) => sum + parseFloat(item.amount),
        0,
      );
      const filteredIncome = filtered
        .filter((item) => parseFloat(item.amount) > 0)
        .reduce((sum, item) => sum + parseFloat(item.amount), 0);
      const filteredExpenses = filtered
        .filter((item) => parseFloat(item.amount) < 0)
        .reduce((sum, item) => sum + parseFloat(item.amount), 0);

      setFilteredSummary({
        balance: filteredBalance,
        income: filteredIncome,
        expenses: filteredExpenses,
      });
    }
  }, [selectedDate, transactions, summary]);

  // We only need one useFocusEffect, the previous one does the job

  const handleDelete = (id) => {
    showModal(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(id),
        },
      ],
      "confirm",
    );
  };

  // Component to show offline transaction indicator
  const OfflineIndicator = () => {
    const [count, setCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);

    // Check for offline transactions
    useEffect(() => {
      const checkOfflineTransactions = async () => {
        const unsyncedCount = await getUnsyncedTransactionCount();
        setCount(unsyncedCount);
      };

      checkOfflineTransactions();

      // Check periodically
      const interval = setInterval(checkOfflineTransactions, 10000);
      return () => clearInterval(interval);
    }, []);

    // Manually trigger sync when indicator is tapped
    const handleSync = async () => {
      if (isSyncing) return;

      try {
        // Check for internet connection first
        const NetInfo = require("@react-native-community/netinfo");
        const networkState = await NetInfo.fetch();

        if (!networkState.isConnected) {
          showModal(
            "No Internet Connection",
            "Please connect to the internet to sync your offline transactions.",
            [{ text: "OK" }],
            "error",
          );
          return;
        }

        setIsSyncing(true);
        const { syncOfflineTransactions } = require("../../lib/offlineSync");
        const result = await syncOfflineTransactions();
        console.log("Manual sync result:", result);

        // Refresh transactions after sync
        await loadData();

        // Check offline count again
        const newCount = await getUnsyncedTransactionCount();
        setCount(newCount);

        if (result.success) {
          showModal(
            "Sync Complete",
            result.message,
            [{ text: "OK" }],
            "success",
          );
        } else if (result.isAlreadySyncing) {
          showModal(
            "Sync in Progress",
            "Please wait for the current sync to complete.",
            [{ text: "OK" }],
            "info",
          );
        } else {
          showModal("Sync Issue", result.message, [{ text: "OK" }], "warning");
        }
      } catch (error) {
        console.error("Manual sync error:", error);
        showModal(
          "Sync Error",
          "Could not sync offline transactions",
          [{ text: "OK" }],
          "error",
        );
      } finally {
        setIsSyncing(false);
      }
    };

    if (count === 0) return null;

    return (
      <TouchableOpacity
        style={styles.offlineIndicator}
        onPress={handleSync}
        disabled={isSyncing}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isSyncing ? "sync-outline" : "cloud-offline-outline"}
          size={16}
          color={COLORS.expense}
          style={[
            { marginRight: 2 },
            isSyncing ? { transform: [{ rotate: "45deg" }] } : null,
          ]}
        />
        <Text style={styles.offlineIndicatorText}>
          {isSyncing ? "Syncing..." : `${count} offline • Tap to sync`}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading && !refreshing) return <PageLoader />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <BalanceCard summary={filteredSummary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <OfflineIndicator />
        </View>

        {/* Date Selector - only show if we have transactions */}
        {transactions.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateSelector}
            contentContainerStyle={styles.dateSelectorContent}
          >
            {availableDates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateButton,
                  selectedDate === date && styles.dateButtonActive,
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text
                  style={[
                    styles.dateButtonText,
                    selectedDate === date && styles.dateButtonTextActive,
                  ]}
                >
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* FlatList renders items lazily — only those on the screen */}
      {/* Updated to use filtered transactions based on date selection */}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={filteredTransactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
