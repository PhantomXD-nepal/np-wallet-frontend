import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import * as coffeeTheme from "../../constants/colors";

const CategoryChart = ({ transactions, filterType }) => {
  const getCategoryIcon = (category) => {
    const iconMap = {
      Groceries: "basket-outline",
      "Food & Drinks": "restaurant-outline",
      Transportation: "car-outline",
      Shopping: "bag-outline",
      Utilities: "flash-outline",
      Entertainment: "game-controller-outline",
      Health: "medical-outline",
      Education: "school-outline",
      Travel: "airplane-outline",
      Salary: "card-outline",
      Freelance: "laptop-outline",
      Investment: "trending-up-outline",
      Gift: "gift-outline",
      Other: "ellipsis-horizontal-outline",
    };
    return iconMap[category] || "wallet-outline";
  };

  const categoryData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const categoryTotals = {};

    transactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount);
      const shouldInclude = filterType === "expense" ? amount < 0 : amount > 0;

      if (shouldInclude) {
        const category = transaction.category || "Other";
        const absoluteAmount = Math.abs(amount);
        categoryTotals[category] =
          (categoryTotals[category] || 0) + absoluteAmount;
      }
    });

    const colors =
      filterType === "expense"
        ? [
            coffeeTheme.expense,
            "#F39C9C",
            "#FF7F7F",
            "#FFB3B3",
            "#A67C5A",
            "#C8956D",
            "#E5D3B7",
            "#D4A574",
          ]
        : [
            coffeeTheme.income,
            "#7ED321",
            "#A8E6A3",
            "#C8F7C5",
            "#4ECDC4",
            "#45B7D1",
            "#96CEB4",
            "#FFEAA7",
          ];

    return Object.entries(categoryTotals)
      .map(([category, amount], index) => ({
        value: amount,
        color: colors[index % colors.length],
        gradientCenterColor: colors[index % colors.length],
        focused: false,
        text: `$${amount.toFixed(0)}`,
        label: category,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, filterType]);

  const totalAmount = categoryData.reduce((sum, item) => sum + item.value, 0);
  const isExpense = filterType === "expense";

  if (categoryData.length === 0) {
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Ionicons
            name="pie-chart-outline"
            size={24}
            color={coffeeTheme.primary}
          />
          <Text style={styles.chartTitle}>
            {isExpense ? "Expenses" : "Income"} by Category
          </Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons
            name={isExpense ? "trending-down-outline" : "trending-up-outline"}
            size={48}
            color={coffeeTheme.textLight}
          />
          <Text style={styles.emptyText}>
            No {isExpense ? "expenses" : "income"} data available
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Ionicons
          name="pie-chart-outline"
          size={24}
          color={coffeeTheme.primary}
        />
        <Text style={styles.chartTitle}>
          {isExpense ? "Expenses" : "Income"} by Category
        </Text>
      </View>
      <View style={styles.pieChartWrapper}>
        <PieChart
          data={categoryData}
          donut
          showGradient
          sectionAutoFocus
          radius={90}
          innerRadius={60}
          innerCircleColor={coffeeTheme.background}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.centerLabelText}>Total</Text>
              <Text style={styles.centerLabelValue}>
                ${totalAmount.toFixed(0)}
              </Text>
            </View>
          )}
        />
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {categoryData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={styles.legendLeft}>
              <View
                style={[styles.legendColor, { backgroundColor: item.color }]}
              />
              <Ionicons
                name={getCategoryIcon(item.label)}
                size={16}
                color={coffeeTheme.text}
                style={styles.legendIcon}
              />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
            <Text style={styles.legendValue}>${item.value.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: coffeeTheme.white,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: coffeeTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: coffeeTheme.text,
  },
  pieChartWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  centerLabel: {
    alignItems: "center",
  },
  centerLabelText: {
    fontSize: 14,
    color: coffeeTheme.textLight,
  },
  centerLabelValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: coffeeTheme.text,
  },
  legendContainer: {
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendIcon: {
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: coffeeTheme.text,
    fontWeight: "500",
  },
  legendValue: {
    fontSize: 14,
    fontWeight: "600",
    color: coffeeTheme.textLight,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: coffeeTheme.textLight,
    textAlign: "center",
  },
});

export default CategoryChart;
