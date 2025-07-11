import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";

const SummaryCards = ({ transactions, filterType }) => {
  const filteredTransactions =
    transactions?.filter((t) =>
      filterType === "expense"
        ? parseFloat(t.amount) < 0
        : parseFloat(t.amount) > 0,
    ) || [];

  const totalAmount = filteredTransactions.reduce(
    (sum, t) => sum + Math.abs(parseFloat(t.amount)),
    0,
  );

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
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
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
    marginBottom: 12,
    gap: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  summaryChange: {
    fontSize: 13,
    color: COLORS.expense,
    fontWeight: "500",
  },
  summaryChangePositive: {
    fontSize: 13,
    color: COLORS.income,
    fontWeight: "500",
  },
});

export default SummaryCards;
