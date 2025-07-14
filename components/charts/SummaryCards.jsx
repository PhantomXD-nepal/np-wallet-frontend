import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth } = Dimensions.get("window");

const SummaryCards = ({ transactions, filterType }) => {
  const filteredTransactions =
    (Array.isArray(transactions)
      ? transactions.filter((t) =>
          filterType === "expense"
            ? parseFloat(t.amount) < 0
            : parseFloat(t.amount) > 0,
        )
      : []) || [];

  const totalAmount = Array.isArray(filteredTransactions)
    ? filteredTransactions.reduce(
        (sum, t) => sum + Math.abs(parseFloat(t.amount)),
        0,
      )
    : 0;

  const avgTransaction =
    filteredTransactions.length > 0
      ? totalAmount / filteredTransactions.length
      : 0;

  const isExpense = filterType === "expense";

  return (
    <>
      <View style={styles.summaryContainer}>
        <LinearGradient
          colors={[
            isExpense ? "#FFE5E5" : "#E5FFE5",
            isExpense ? "#FFF5F5" : "#F5FFF5",
          ]}
          style={[styles.summaryCard, styles.gradientCard]}
        >
          <View style={styles.summaryHeader}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: isExpense
                    ? `${COLORS.expense}20`
                    : `${COLORS.income}20`,
                },
              ]}
            >
              <Ionicons
                name={
                  isExpense ? "trending-down-outline" : "trending-up-outline"
                }
                size={24}
                color={isExpense ? COLORS.expense : COLORS.income}
              />
            </View>
            <Text style={styles.summaryLabel}>
              Total {isExpense ? "Expenses" : "Income"}
            </Text>
          </View>
          <Text
            style={[
              styles.summaryValue,
              {
                color: isExpense ? COLORS.expense : COLORS.income,
              },
            ]}
          >
            ${totalAmount.toFixed(2)}
          </Text>
          <View style={styles.changeContainer}>
            <Ionicons
              name={isExpense ? "arrow-up" : "arrow-up"}
              size={16}
              color={isExpense ? COLORS.expense : COLORS.income}
            />
            <Text
              style={
                isExpense ? styles.summaryChange : styles.summaryChangePositive
              }
            >
              {isExpense ? "12% from last week" : "8% from last week"}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: `${COLORS.primary}20` },
              ]}
            >
              <Ionicons
                name="receipt-outline"
                size={24}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.summaryLabel}>Transactions</Text>
          </View>
          <Text style={styles.summaryValue}>{filteredTransactions.length}</Text>
          <View style={styles.changeContainer}>
            <Ionicons
              name={isExpense ? "arrow-down" : "arrow-up"}
              size={16}
              color={isExpense ? COLORS.income : COLORS.income}
            />
            <Text style={styles.summaryChangePositive}>
              {isExpense ? "3% from last week" : "5% from last week"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.fullWidthCard]}>
          <View style={styles.summaryHeader}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: `${COLORS.income}20` },
              ]}
            >
              <Ionicons
                name="calculator-outline"
                size={24}
                color={COLORS.income}
              />
            </View>
            <Text style={styles.summaryLabel}>Average Transaction</Text>
          </View>
          <Text style={styles.summaryValue}>${avgTransaction.toFixed(2)}</Text>
          <Text style={styles.summaryChange}>
            Based on {filteredTransactions.length}{" "}
            {isExpense ? "expenses" : "income sources"}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: Math.max(screenWidth * 0.04, 16),
    marginBottom: 16,
    gap: Math.max(screenWidth * 0.03, 8),
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: Math.max(screenWidth * 0.04, 14),
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientCard: {
    overflow: "hidden",
  },
  fullWidthCard: {
    flex: 1,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Math.max(screenWidth * 0.025, 8),
    gap: Math.max(screenWidth * 0.02, 6),
  },
  iconCircle: {
    width: Math.max(screenWidth * 0.1, 36),
    height: Math.max(screenWidth * 0.1, 36),
    borderRadius: Math.max(screenWidth * 0.05, 18),
    justifyContent: "center",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: Math.max(screenWidth * 0.032, 12),
    color: COLORS.textLight,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: Math.max(screenWidth * 0.065, 22),
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: Math.max(screenWidth * 0.02, 6),
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Math.max(screenWidth * 0.01, 3),
  },
  summaryChange: {
    fontSize: Math.max(screenWidth * 0.03, 11),
    color: COLORS.expense,
    fontWeight: "500",
  },
  summaryChangePositive: {
    fontSize: Math.max(screenWidth * 0.03, 11),
    color: COLORS.income,
    fontWeight: "500",
  },
});

export default SummaryCards;
