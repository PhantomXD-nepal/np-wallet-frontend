import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

/**
 * TrendSummary component displays insightful trends and statistics for the selected time period
 *
 * @param {Array} transactions - All transactions data
 * @param {string} filterType - 'expense' or 'income'
 * @param {string} timeFrame - 'daily', 'weekly', or 'monthly'
 */
const TrendSummary = ({ transactions, filterType, timeFrame }) => {
  const isExpense = filterType === "expense";

  // Calculate trends and insights based on transaction data
  const insights = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Filter transactions by type (expense/income)
    const filteredTransactions = transactions.filter(t =>
      isExpense ? parseFloat(t.amount) < 0 : parseFloat(t.amount) > 0
    );

    if (filteredTransactions.length === 0) {
      return [];
    }

    // Get current date for time calculations
    const now = new Date();

    // Calculate date thresholds for different periods
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);

    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 14);

    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const twoMonthsAgo = new Date(now);
    twoMonthsAgo.setMonth(now.getMonth() - 2);

    // Filter transactions by time periods
    const currentPeriodTxs = filteredTransactions.filter(t => {
      const date = new Date(t.created_at);
      switch (timeFrame) {
        case 'daily':
          return date >= oneWeekAgo;
        case 'weekly':
          return date >= oneMonthAgo;
        case 'monthly':
          return date >= twoMonthsAgo;
        default:
          return true;
      }
    });

    // Sort by amount to find largest transaction
    const sortedByAmount = [...currentPeriodTxs].sort((a, b) =>
      Math.abs(parseFloat(b.amount)) - Math.abs(parseFloat(a.amount))
    );

    // Group by category
    const categoryTotals = {};
    currentPeriodTxs.forEach(t => {
      const category = t.category || 'Other';
      const amount = Math.abs(parseFloat(t.amount));
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += amount;
    });

    // Find top category
    let topCategory = null;
    let topCategoryAmount = 0;
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      if (amount > topCategoryAmount) {
        topCategory = category;
        topCategoryAmount = amount;
      }
    });

    // Calculate trend compared to previous period
    let trendPercentage = 0;
    let currentPeriodTotal = 0;
    let previousPeriodTotal = 0;

    switch (timeFrame) {
      case 'daily':
        // Compare last 7 days to previous 7 days
        currentPeriodTotal = currentPeriodTxs.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
        previousPeriodTotal = filteredTransactions
          .filter(t => {
            const date = new Date(t.created_at);
            return date >= twoWeeksAgo && date < oneWeekAgo;
          })
          .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
        break;
      case 'weekly':
        // Compare last 4 weeks to previous 4 weeks
        currentPeriodTotal = currentPeriodTxs.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
        previousPeriodTotal = filteredTransactions
          .filter(t => {
            const date = new Date(t.created_at);
            return date >= twoMonthsAgo && date < oneMonthAgo;
          })
          .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
        break;
      case 'monthly':
        // Compare last 6 months trend (simplistic approach)
        const byMonth = {};
        filteredTransactions.forEach(t => {
          const date = new Date(t.created_at);
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
          if (!byMonth[monthKey]) byMonth[monthKey] = 0;
          byMonth[monthKey] += Math.abs(parseFloat(t.amount));
        });

        const monthKeys = Object.keys(byMonth).sort().reverse();
        if (monthKeys.length >= 2) {
          currentPeriodTotal = byMonth[monthKeys[0]] || 0;
          previousPeriodTotal = byMonth[monthKeys[1]] || 0;
        }
        break;
    }

    // Calculate percentage change
    if (previousPeriodTotal > 0) {
      trendPercentage = ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100;
    }

    // Generate insights based on calculations
    const results = [];

    // Add trend insight
    if (previousPeriodTotal > 0) {
      const trendLabel = isExpense
        ? (trendPercentage > 0 ? 'increased' : 'decreased')
        : (trendPercentage > 0 ? 'increased' : 'decreased');

      const trendIcon = isExpense
        ? (trendPercentage > 0 ? 'trending-up' : 'trending-down')
        : (trendPercentage > 0 ? 'trending-up' : 'trending-down');

      const trendColor = isExpense
        ? (trendPercentage > 0 ? COLORS.expense : COLORS.income)
        : (trendPercentage > 0 ? COLORS.income : COLORS.expense);

      results.push({
        id: 'trend',
        icon: trendIcon,
        color: trendColor,
        text: `Your ${isExpense ? 'spending' : 'income'} has ${trendLabel} by ${Math.abs(trendPercentage).toFixed(1)}% compared to the previous period.`
      });
    }

    // Add top category insight
    if (topCategory) {
      const percentage = (topCategoryAmount / currentPeriodTotal) * 100;
      results.push({
        id: 'topCategory',
        icon: 'pie-chart',
        color: isExpense ? COLORS.expense : COLORS.income,
        text: `${Math.round(percentage)}% of your ${isExpense ? 'expenses' : 'income'} went to ${topCategory}.`
      });
    }

    // Add largest transaction insight
    if (sortedByAmount.length > 0) {
      const largestTx = sortedByAmount[0];
      results.push({
        id: 'largestTransaction',
        icon: 'cash',
        color: COLORS.primary,
        text: `Your largest ${isExpense ? 'expense' : 'income'} was $${Math.abs(parseFloat(largestTx.amount)).toFixed(2)} for ${largestTx.title}.`
      });
    }

    // Add frequency insight
    const transactionsPerDay = currentPeriodTxs.length / (timeFrame === 'daily' ? 7 : timeFrame === 'weekly' ? 28 : 180);
    if (transactionsPerDay > 0) {
      results.push({
        id: 'frequency',
        icon: 'time',
        color: COLORS.primary,
        text: `You average ${transactionsPerDay.toFixed(1)} ${isExpense ? 'expenses' : 'transactions'} per day.`
      });
    }

    return results;
  }, [transactions, filterType, timeFrame]);

  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bulb-outline" size={24} color={COLORS.primary} />
        <Text style={styles.title}>Insights</Text>
      </View>

      <View style={styles.insightsContainer}>
        {insights.map((insight, index) => (
          <View key={insight.id} style={styles.insightItem}>
            <View style={[styles.iconContainer, { backgroundColor: `${insight.color}15` }]}>
              <Ionicons name={insight.icon} size={20} color={insight.color} />
            </View>
            <Text style={styles.insightText}>{insight.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  insightsContainer: {
    gap: 12,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});

export default TrendSummary;
