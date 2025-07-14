import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const { width: screenWidth } = Dimensions.get("window");

const TimeFrameChart = ({ transactions, filterType, timeFrame }) => {
  const isExpense = filterType === "expense";
  const chartColor = isExpense ? COLORS.expense : COLORS.income;
  const gradientColor = isExpense ? "#FFD5D5" : "#D5FFD5";

  // Create data for the chart based on the selected time frame
  const chartData = useMemo(() => {
    // Default empty state data with appropriate period labels
    const getDefaultData = () => {
      const now = new Date();

      if (timeFrame === "daily") {
        // Last 7 days
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(date.getDate() - (6 - i));
          return {
            value: 0,
            label: date.toLocaleDateString("en", { weekday: "short" })[0],
            labelTextStyle: { color: COLORS.textLight, fontSize: 12 },
            frontColor: COLORS.border,
            gradientColor: COLORS.border,
          };
        });
      } else if (timeFrame === "weekly") {
        // Last 4 weeks
        return Array.from({ length: 4 }, (_, i) => ({
          value: 0,
          label: `W${i + 1}`,
          labelTextStyle: { color: COLORS.textLight, fontSize: 12 },
          frontColor: COLORS.border,
          gradientColor: COLORS.border,
        }));
      } else {
        // Last 6 months
        return Array.from({ length: 6 }, (_, i) => {
          const date = new Date(now);
          date.setMonth(date.getMonth() - (5 - i));
          return {
            value: 0,
            label: date.toLocaleDateString("en", { month: "short" }),
            labelTextStyle: { color: COLORS.textLight, fontSize: 12 },
            frontColor: COLORS.border,
            gradientColor: COLORS.border,
          };
        });
      }
    };

    if (
      !transactions ||
      !Array.isArray(transactions) ||
      transactions.length === 0
    )
      return getDefaultData();

    const now = new Date();
    let dataPoints = [];
    let dateFormat = {};
    let groupedData = {};

    // Set up grouping based on time frame
    switch (timeFrame) {
      case "daily":
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          groupedData[dateStr] = {
            date: dateStr,
            value: 0,
            label: date.toLocaleDateString("en", { weekday: "short" }),
          };
        }
        dateFormat = (date) => date.toISOString().split("T")[0];
        break;

      case "weekly":
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i * 7);
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);

          const weekLabel = `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`;
          const weekKey = `week-${3 - i}`;

          groupedData[weekKey] = {
            date: weekKey,
            value: 0,
            label: `W${3 - i + 1}`,
          };
        }

        // Function to determine which week a date belongs to
        dateFormat = (date) => {
          const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
          const weekIndex = Math.floor(diff / 7);
          if (weekIndex >= 0 && weekIndex <= 3) return `week-${weekIndex}`;
          return null;
        };
        break;

      case "monthly":
        // Last 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          groupedData[monthKey] = {
            date: monthKey,
            value: 0,
            label: date.toLocaleDateString("en", { month: "short" }),
          };
        }
        dateFormat = (date) => `${date.getFullYear()}-${date.getMonth() + 1}`;
        break;
    }

    // Process transactions and group them
    if (Array.isArray(transactions)) {
      transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.created_at);
        const amount = parseFloat(transaction.amount);
        const key = dateFormat(transactionDate);

        // Skip if outside our time range
        if (!key || !groupedData[key]) return;

        // Add to the appropriate group if it matches our filter type
        if (
          (filterType === "expense" && amount < 0) ||
          (filterType === "income" && amount > 0)
        ) {
          groupedData[key].value += Math.abs(amount);
        }
      });
    }

    // Convert to array and format for chart
    return Object.values(groupedData).map((item) => ({
      value: item.value,
      label: item.label,
      labelTextStyle: { color: COLORS.textLight, fontSize: 12 },
      frontColor: item.value > 0 ? chartColor : COLORS.border,
      gradientColor: item.value > 0 ? gradientColor : COLORS.border,
      topLabelComponent: () => (
        <Text style={styles.dataPointLabel}>${Math.round(item.value)}</Text>
      ),
    }));
  }, [transactions, filterType, timeFrame]);

  // Calculate the max value for the chart
  const maxValue =
    chartData && chartData.length
      ? Math.max(...chartData.map((d) => d.value), 100)
      : 100;

  // Determine chart title based on time frame
  const getChartTitle = () => {
    switch (timeFrame) {
      case "daily":
        return `Daily ${isExpense ? "Expenses" : "Income"} (Last 7 Days)`;
      case "weekly":
        return `Weekly ${isExpense ? "Expenses" : "Income"} (Last 4 Weeks)`;
      case "monthly":
        return `Monthly ${isExpense ? "Expenses" : "Income"} (Last 6 Months)`;
      default:
        return `${isExpense ? "Expenses" : "Income"} Over Time`;
    }
  };

  // Get the appropriate icon for the chart
  const getChartIcon = () => {
    switch (timeFrame) {
      case "daily":
        return "today-outline";
      case "weekly":
        return "calendar-number-outline";
      case "monthly":
        return "calendar-clear-outline";
      default:
        return "analytics-outline";
    }
  };

  // Calculate total for this time period
  const totalInPeriod =
    chartData && chartData.length
      ? chartData.reduce((sum, item) => sum + item.value, 0)
      : 0;

  // Calculate average per period
  const getAverageLabel = () => {
    switch (timeFrame) {
      case "daily":
        return "Daily Average";
      case "weekly":
        return "Weekly Average";
      case "monthly":
        return "Monthly Average";
      default:
        return "Average";
    }
  };

  const average =
    chartData && chartData.length > 0 ? totalInPeriod / chartData.length : 0;

  // If there's no transaction data, show an empty state
  if (
    !transactions ||
    !Array.isArray(transactions) ||
    transactions.length === 0
  ) {
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Ionicons name={getChartIcon()} size={24} color={COLORS.primary} />
          <Text style={styles.chartTitle}>{getChartTitle()}</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons
            name={isExpense ? "trending-down-outline" : "trending-up-outline"}
            size={48}
            color={COLORS.textLight}
          />
          <Text style={styles.emptyText}>
            No {isExpense ? "expenses" : "income"} data available for this
            period
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Ionicons name={getChartIcon()} size={24} color={COLORS.primary} />
        <Text style={styles.chartTitle}>{getChartTitle()}</Text>
      </View>

      {/* Summary stats */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValue}>${totalInPeriod.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>{getAverageLabel()}</Text>
          <Text style={styles.summaryValue}>${average.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        <View style={styles.chartTouchable}>
          {timeFrame === "monthly" ? (
            <LineChart
              data={chartData}
              height={180}
              width={screenWidth - 60}
              noOfSections={4}
              areaChart={true}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={COLORS.border}
              color={chartColor}
              hideDataPoints={false}
              dataPointsColor={chartColor}
              startFillColor={gradientColor}
              startOpacity={0.8}
              endOpacity={0.1}
              spacing={Math.max(screenWidth * 0.08, 30)}
              maxValue={maxValue}
              initialSpacing={10}
              yAxisTextStyle={styles.yAxisText}
              xAxisLabelTextStyle={styles.xAxisText}
              rulesType="solid"
              rulesColor={`${COLORS.border}50`}
              yAxisLabelPrefix="$"
            />
          ) : (
            <BarChart
              data={chartData}
              height={200}
              width={screenWidth - 60}
              barWidth={
                timeFrame === "daily"
                  ? Math.max(screenWidth * 0.06, 25)
                  : Math.max(screenWidth * 0.08, 32)
              }
              noOfSections={4}
              barBorderRadius={8}
              frontColor={chartColor}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={COLORS.border}
              maxValue={maxValue}
              spacing={
                timeFrame === "daily"
                  ? Math.max(screenWidth * 0.04, 20)
                  : Math.max(screenWidth * 0.06, 25)
              }
              backgroundColor="transparent"
              showGradient={true}
              gradientColor={gradientColor}
              yAxisTextStyle={styles.yAxisText}
              xAxisLabelTextStyle={styles.xAxisText}
              showValuesAsTopLabel={true}
              topLabelContainerStyle={styles.topLabelContainer}
              renderTooltip={(item, index) => (
                <View style={styles.tooltipContainer}>
                  <Text style={styles.tooltipText}>
                    ${item.value.toFixed(2)}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
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
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  chartWrapper: {
    alignItems: "center",
    marginTop: 10,
    borderRadius: 8,
    overflow: "hidden",
    paddingHorizontal: 5,
  },
  yAxisText: {
    color: COLORS.textLight,
    fontSize: Math.max(screenWidth * 0.025, 10),
  },
  xAxisText: {
    color: COLORS.textLight,
    fontSize: Math.max(screenWidth * 0.025, 10),
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
  dataPointLabel: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chartTouchable: {
    borderRadius: 8,
    overflow: "hidden",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  topLabelContainer: {
    marginBottom: 4,
  },
  tooltipContainer: {
    backgroundColor: COLORS.text,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  tooltipText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 12,
  },
});

export default TimeFrameChart;
