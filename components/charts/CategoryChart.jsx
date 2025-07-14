import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useState } from "react";

const { width: screenWidth } = Dimensions.get("window");

const CategoryChart = ({ transactions, filterType }) => {
  const fadeAnim = useState(new Animated.Value(0))[0];
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
      Rent: "home-outline",
      Bills: "receipt-outline",
      Other: "ellipsis-horizontal-outline",
    };
    return iconMap[category] || "wallet-outline";
  };

  const categoryData = useMemo(() => {
    // Default empty state data
    const defaultData = [
      {
        value: 1,
        color: filterType === "expense" ? COLORS.expense : COLORS.income,
        gradientCenterColor: filterType === "expense" ? "#F39C9C" : "#7ED321",
        focused: true,
        text: "$0",
        label: "No Data",
      },
    ];

    if (
      !transactions ||
      !Array.isArray(transactions) ||
      transactions.length === 0
    ) {
      return defaultData;
    }

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
            COLORS.expense,
            "#F39C9C",
            "#FF7F7F",
            "#FFB3B3",
            "#E57373",
            "#EF9A9A",
            "#FFCDD2",
            "#F8BBD0",
            "#CE93D8",
            "#9FA8DA",
            "#A5D6A7",
            "#FFF59D",
            "#FFCC80",
          ]
        : [
            COLORS.income,
            "#7ED321",
            "#A8E6A3",
            "#C8F7C5",
            "#81C784",
            "#4DB6AC",
            "#4DD0E1",
            "#4FC3F7",
            "#64B5F6",
            "#7986CB",
            "#9575CD",
            "#7E57C2",
            "#FFD54F",
          ];

    const entries = Object.entries(categoryTotals);

    // If we have no data entries after filtering, return default data
    if (entries.length === 0) {
      return defaultData;
    }

    return entries
      .map(([category, amount], index) => ({
        value: amount,
        color: colors[index % colors.length],
        gradientCenterColor: colors[(index + 2) % colors.length], // Slightly different shade for gradient
        focused: index === 0, // Focus the largest category
        text: `$${amount.toFixed(0)}`,
        label: category,
        shiftRadius: index === 0 ? 5 : 0, // Shift out the largest segment
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, filterType]);

  const totalAmount =
    categoryData && categoryData.length
      ? categoryData.reduce((sum, item) => sum + (item.value || 0), 0)
      : 0;
  const isExpense = filterType === "expense";

  // Calculate responsive dimensions for mobile
  const chartRadius = Math.min(screenWidth * 0.25, 90);
  const chartInnerRadius = chartRadius * 0.65;

  // Check if we're using the default data (value = 1, label = "No Data")
  if (categoryData.length === 1 && categoryData[0].label === "No Data") {
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="pie-chart-outline"
              size={24}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.chartTitle}>
            {isExpense ? "Expenses" : "Income"} by Category
          </Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons
            name={isExpense ? "trending-down-outline" : "trending-up-outline"}
            size={48}
            color={COLORS.textLight}
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
        <View style={styles.iconCircle}>
          <Ionicons name="pie-chart-outline" size={24} color={COLORS.primary} />
        </View>
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
          radius={chartRadius}
          innerRadius={chartInnerRadius}
          innerCircleColor={COLORS.background}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text
                style={[
                  styles.centerLabelText,
                  { fontSize: chartRadius * 0.15 },
                ]}
              >
                Total
              </Text>
              <Text
                style={[
                  styles.centerLabelValue,
                  { fontSize: chartRadius * 0.2 },
                ]}
              >
                ${totalAmount.toFixed(0)}
              </Text>
            </View>
          )}
        />
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {categoryData &&
          categoryData.map((item, index) => (
            <Animated.View key={index} style={styles.legendItem}>
              <Animated.View style={[styles.legendLeft, { opacity: fadeAnim }]}>
                <View
                  style={[
                    styles.legendColor,
                    {
                      backgroundColor: item.color,
                      width: index === 0 ? 16 : 12,
                      height: index === 0 ? 16 : 12,
                    },
                  ]}
                />
                <View style={styles.iconCircleSmall}>
                  <Ionicons
                    name={getCategoryIcon(item.label)}
                    size={14}
                    color={COLORS.text}
                  />
                </View>
                <Text
                  style={[
                    styles.legendText,
                    index === 0 && styles.legendTextBold,
                  ]}
                >
                  {item.label}
                </Text>
              </Animated.View>
              <Text
                style={[
                  styles.legendValue,
                  index === 0 && styles.legendValueBold,
                ]}
              >
                ${item.value.toFixed(2)}
              </Text>
            </Animated.View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
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
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  pieChartWrapper: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  centerLabel: {
    alignItems: "center",
  },
  centerLabelText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  centerLabelValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  legendContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.border}50`,
    paddingTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingVertical: 4,
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
  legendText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  legendTextBold: {
    fontWeight: "700",
  },
  legendValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  legendValueBold: {
    fontWeight: "700",
    color: COLORS.text,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
  },
});

export default CategoryChart;
