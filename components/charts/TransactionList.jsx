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

const TransactionsList = ({ transactions, filterType }) => {
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

  const filteredTransactions =
    transactions
      ?.filter((t) =>
        filterType === "expense"
          ? parseFloat(t.amount) < 0
          : parseFloat(t.amount) > 0,
      )
      .slice(0, 5) || [];

  const isExpense = filterType === "expense";

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Ionicons name="time-outline" size={24} color={coffeeTheme.primary} />
        <Text style={styles.chartTitle}>
          Recent {isExpense ? "Expenses" : "Income"}
        </Text>
      </View>

      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name={isExpense ? "trending-down-outline" : "trending-up-outline"}
            size={48}
            color={coffeeTheme.textLight}
          />
          <Text style={styles.emptyText}>
            No recent {isExpense ? "expenses" : "income"} found
          </Text>
        </View>
      ) : (
        <>
          {filteredTransactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
            >
              <View style={styles.transactionLeft}>
                <View
                  style={[
                    styles.transactionIconContainer,
                    {
                      backgroundColor:
                        parseFloat(transaction.amount) < 0
                          ? "#FFE5E5"
                          : "#E8F5E8",
                    },
                  ]}
                >
                  <Ionicons
                    name={getCategoryIcon(transaction.category)}
                    size={20}
                    color={
                      parseFloat(transaction.amount) < 0
                        ? coffeeTheme.expense
                        : coffeeTheme.income
                    }
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>
                    {transaction.title}
                  </Text>
                  <View style={styles.transactionMeta}>
                    <Text style={styles.transactionCategory}>
                      {transaction.category}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.created_at).toLocaleDateString(
                        "en",
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color:
                        parseFloat(transaction.amount) < 0
                          ? coffeeTheme.expense
                          : coffeeTheme.income,
                    },
                  ]}
                >
                  {parseFloat(transaction.amount) < 0 ? "-" : "+"}$
                  {Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                </Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={16}
                  color={coffeeTheme.textLight}
                />
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>
              View All {isExpense ? "Expenses" : "Income"}
            </Text>
            <Ionicons
              name="arrow-forward-outline"
              size={16}
              color={coffeeTheme.primary}
            />
          </TouchableOpacity>
        </>
      )}
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
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: coffeeTheme.border,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: coffeeTheme.text,
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  transactionCategory: {
    fontSize: 14,
    color: coffeeTheme.textLight,
    fontWeight: "500",
  },
  transactionDate: {
    fontSize: 12,
    color: coffeeTheme.textLight,
  },
  transactionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
    gap: 8,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: coffeeTheme.primary,
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

export default TransactionsList;
