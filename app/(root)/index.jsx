import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, useRouter, useFocusEffect } from "expo-router";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect, useState, useCallback } from "react";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound";

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

  // Refresh data when the screen comes into focus (returning from create screen)
  useFocusEffect(
    useCallback(() => {
      loadData();
      setSelectedDate("All"); // Reset to "All" when returning to this screen
      return () => {}; // cleanup function
    }, [loadData]),
  );

  const handleDelete = (id) => {
    Alert.alert(
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
