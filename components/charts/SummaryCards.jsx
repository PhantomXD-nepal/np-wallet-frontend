import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons
              name={isExpense ? "trending-down-outline" : "trending-up-outline"}
              size={24}
              color={isExpense ? coffeeTheme.expense : coffeeTheme.income}
            />
            <Text style={styles.summaryLabel}>
              Total {isExpense ? "Expenses" : "Income"}
            </Text>
          </View>
          <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
          <Text
            style={
              isExpense ? styles.summaryChange : styles.summaryChangePositive
            }
          >
            {isExpense ? "+12% from last week" : "+8% from last week"}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons
              name="receipt-outline"
              size={24}
              color={coffeeTheme.primary}
            />
            <Text style={styles.summaryLabel}>Transactions</Text>
          </View>
          <Text style={styles.summaryValue}>{filteredTransactions.length}</Text>
          <Text style={styles.summaryChangePositive}>
            {isExpense ? "-3% from last week" : "+5% from last week"}
          </Text>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.fullWidthCard]}>
          <View style={styles.summaryHeader}>
            <Ionicons
              name="calculator-outline"
              size={24}
              color={coffeeTheme.income}
            />
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
    backgroundColor: coffeeTheme.white,
    padding: 20,
    borderRadius: 16,
    shadowColor: coffeeTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  summaryLabel: {
    fontSize: 14,
    color: coffeeTheme.textLight,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: coffeeTheme.text,
    marginBottom: 4,
  },
  summaryChange: {
    fontSize: 12,
    color: coffeeTheme.expense,
    fontWeight: "500",
  },
  summaryChangePositive: {
    fontSize: 12,
    color: coffeeTheme.income,
    fontWeight: "500",
  },
});

export default SummaryCards;
