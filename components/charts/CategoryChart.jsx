import React, { useMemo } from "react";
import { View, Text, StyleSheet, Animated, Platform } from "react-native";
import { PieChart } from "../charts/ChartWebCompatibility";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

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
      Rent: "home-outline",
      Bills: "receipt-outline",
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

    return Object.entries(categoryTotals)
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

  const totalAmount = categoryData.reduce((sum, item) => sum + item.value, 0);
  const isExpense = filterType === "expense";

  if (categoryData.length === 0) {
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
          showGradient={Platform.OS !== "web"}
          sectionAutoFocus={Platform.OS !== "web"}
          radius={90}
          innerRadius={60}
          innerCircleColor={COLORS.background}
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
          <Animated.View key={index} style={styles.legendItem}>
            <View style={styles.legendLeft}>
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
            </View>
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
