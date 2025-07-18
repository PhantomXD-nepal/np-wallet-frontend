import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

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

const DailyChart = ({ transactions, filterType }) => {
  const dailyData = useMemo(() => {
    if (
      !transactions ||
      !Array.isArray(transactions) ||
      transactions.length === 0
    ) {
      // Return a default dataset with zero values to prevent rendering issues
      const today = new Date();
      const defaultData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        defaultData.push({
          value: 0,
          label: date.toLocaleDateString("en", { weekday: "short" })[0],
          frontColor: coffeeTheme.border,
          gradientColor: coffeeTheme.border,
        });
      }
      return defaultData;
    }

    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en", { weekday: "short" })[0],
        amount: 0,
      });
    }

    if (Array.isArray(transactions)) {
      transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.created_at)
          .toISOString()
          .split("T")[0];
        const dayIndex = last7Days.findIndex(
          (day) => day.date === transactionDate,
        );
        const amount = parseFloat(transaction.amount);

        if (dayIndex !== -1) {
          if (filterType === "expense" && amount < 0) {
            last7Days[dayIndex].amount += Math.abs(amount);
          } else if (filterType === "income" && amount > 0) {
            last7Days[dayIndex].amount += amount;
          }
        }
      });
    }

    const chartColor =
      filterType === "expense" ? coffeeTheme.expense : coffeeTheme.income;
    const gradientColor = filterType === "expense" ? "#F39C9C" : "#7ED321";

    return last7Days.map((day) => ({
      value: day.amount,
      label: day.label,
      frontColor: day.amount > 0 ? chartColor : coffeeTheme.border,
      gradientColor: day.amount > 0 ? gradientColor : coffeeTheme.border,
    }));
  }, [transactions, filterType]);

  const maxDailyAmount =
    Array.isArray(dailyData) && dailyData.length > 0
      ? Math.max(...dailyData.map((d) => d.value), 10)
      : 10;
  const isExpense = filterType === "expense";

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Ionicons
          name="bar-chart-outline"
          size={24}
          color={coffeeTheme.primary}
        />
        <Text style={styles.chartTitle}>
          Daily {isExpense ? "Expenses" : "Income"} (Last 7 Days)
        </Text>
      </View>
      <View style={styles.chartWrapper}>
        <BarChart
          barWidth={Math.max(screenWidth * 0.06, 25)}
          noOfSections={4}
          barBorderRadius={8}
          frontColor={isExpense ? coffeeTheme.expense : coffeeTheme.income}
          data={dailyData}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={coffeeTheme.border}
          yAxisTextStyle={styles.yAxisText}
          xAxisLabelTextStyle={styles.xAxisText}
          maxValue={maxDailyAmount}
          spacing={Math.max(screenWidth * 0.04, 20)}
          backgroundColor="transparent"
          showGradient={true}
          gradientColor={isExpense ? "#F39C9C" : "#7ED321"}
          height={180}
          width={screenWidth - 60}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: coffeeTheme.white,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
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
  chartWrapper: {
    alignItems: "center",
    paddingHorizontal: 5,
  },
  yAxisText: {
    color: coffeeTheme.textLight,
    fontSize: Math.max(screenWidth * 0.025, 10),
  },
  xAxisText: {
    color: coffeeTheme.textLight,
    fontSize: Math.max(screenWidth * 0.025, 10),
  },
});

export default DailyChart;
