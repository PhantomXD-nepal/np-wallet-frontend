import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  AppState,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "../../hooks/useTransactions";
import { useUser } from "@clerk/clerk-expo";
import { COLORS } from "../../constants/colors";

// Import components
import SummaryCards from "../../components/charts/SummaryCards";
import CategoryChart from "../../components/charts/CategoryChart";
import TransactionsList from "../../components/charts/TransactionList";
import TimeFrameSelector from "../../components/charts/TimeFrameSelector";
import TimeFrameChart from "../../components/charts/TimeFrameChart";
import TrendSummary from "../../components/charts/TrendSummary";

const ExpenseChartPage = () => {
  const { user } = useUser();
  const { transactions, summary, isLoading, loadData } = useTransactions(
    user?.id,
  );
  const [filterType, setFilterType] = useState("expense"); // 'expense' or 'income'
  const [timeFrame, setTimeFrame] = useState("daily"); // 'daily', 'weekly', 'monthly'
  const fadeAnim = useState(new Animated.Value(0))[0];
  const appState = useRef(AppState.currentState);
  const refreshTimestamp = useRef(Date.now());

  // Function to refresh data
  const refreshData = useCallback(() => {
    if (user?.id) {
      loadData();
      refreshTimestamp.current = Date.now();
    }
  }, [user?.id, loadData]);

  // Initial data load and fade in animation
  useEffect(() => {
    refreshData();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [user?.id, refreshData, fadeAnim]);

  // Monitor app state for background/foreground transitions
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // When app comes to foreground after being in background
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        Date.now() - refreshTimestamp.current > 30000 // 30 seconds threshold
      ) {
        // Refresh data
        refreshData();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [refreshData]);

  const toggleFilter = () => {
    setFilterType((prev) => (prev === "expense" ? "income" : "expense"));
  };

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="analytics-outline" size={48} color={COLORS.primary} />
          <Text style={styles.loadingText}>Brewing your analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isExpense = filterType === "expense";

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
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
                color={isExpense ? COLORS.expense : COLORS.income}
              />
              <Text
                style={[
                  styles.filterText,
                  {
                    color: isExpense ? COLORS.expense : COLORS.income,
                  },
                ]}
              >
                {isExpense ? "Expenses" : "Income"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Frame Selector */}
        <View style={styles.timeFrameContainer}>
          <TimeFrameSelector
            activeTimeFrame={timeFrame}
            onTimeFrameChange={handleTimeFrameChange}
          />
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={refreshData}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <SummaryCards transactions={transactions} filterType={filterType} />

        {/* Time Period Chart (replaces Daily Chart) */}
        <TimeFrameChart
          transactions={transactions}
          filterType={filterType}
          timeFrame={timeFrame}
        />

        {/* Trend Summary */}
        <TrendSummary
          transactions={transactions}
          filterType={filterType}
          timeFrame={timeFrame}
        />

        {/* Category Chart */}
        <CategoryChart transactions={transactions} filterType={filterType} />

        {/* Recent Transactions */}
        <TransactionsList transactions={transactions} filterType={filterType} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.textLight,
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
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  filterButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  timeFrameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: COLORS.white,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginLeft: 10,
  },
  refreshIcon: {
    fontSize: 24,
    color: COLORS.primary,
  },
  refreshText: {
    fontSize: 14,
    color: COLORS.primary,
  },
});

export default ExpenseChartPage;
