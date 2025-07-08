import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "../../hooks/useTransactions";
import { useUser } from "@clerk/clerk-expo";

// Import components
import SummaryCards from "../../components/charts/SummaryCards";
import DailyChart from "../../components/charts/DailyChart";
import CategoryChart from "../../components/charts/CategoryChart";
import TransactionsList from "../../components/charts/TransactionList";

const coffeeTheme = {
  primary: "#8B593E",
  background: "#FFF8F3",
  text: "#4A3428",
  border: "#E5D3B7",
  white: "#FFFFFF",
  textLight: "#9A8478",
  expense: "#E74C3C",
  income: "#2ECC71",
  card: "#FFFFFF",
  shadow: "#000000",
};

const ExpenseChartPage = () => {
  const { user } = useUser();
  const { transactions, summary, isLoading, loadData } = useTransactions(
    user?.id,
  );
  const [filterType, setFilterType] = useState("expense"); // 'expense' or 'income'

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const toggleFilter = () => {
    setFilterType((prev) => (prev === "expense" ? "income" : "expense"));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons
            name="analytics-outline"
            size={48}
            color={coffeeTheme.primary}
          />
          <Text style={styles.loadingText}>Brewing your analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isExpense = filterType === "expense";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>
                {isExpense ? "Expense" : "Income"} Analytics
              </Text>
              <Text style={styles.subtitle}>
                Track your {isExpense ? "spending patterns" : "income sources"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={toggleFilter}
            >
              <Ionicons
                name={
                  isExpense ? "trending-down-outline" : "trending-up-outline"
                }
                size={20}
                color={isExpense ? coffeeTheme.expense : coffeeTheme.income}
              />
              <Text
                style={[
                  styles.filterText,
                  {
                    color: isExpense ? coffeeTheme.expense : coffeeTheme.income,
                  },
                ]}
              >
                {isExpense ? "Expenses" : "Income"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Cards */}
        <SummaryCards transactions={transactions} filterType={filterType} />

        {/* Daily Chart */}
        <DailyChart transactions={transactions} filterType={filterType} />

        {/* Category Chart */}
        <CategoryChart transactions={transactions} filterType={filterType} />

        {/* Recent Transactions */}
        <TransactionsList transactions={transactions} filterType={filterType} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: coffeeTheme.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: coffeeTheme.textLight,
    fontWeight: "500",
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: coffeeTheme.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: coffeeTheme.textLight,
  },
  filterButton: {
    backgroundColor: coffeeTheme.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: coffeeTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ExpenseChartPage;
