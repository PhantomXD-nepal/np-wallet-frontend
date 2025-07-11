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

const TransactionsList = ({ transactions, filterType }) => {
  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en", { weekday: "long" });
    } else {
      return date.toLocaleDateString("en", { month: "short", day: "numeric" });
    }
  };
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
        <View style={styles.iconCircle}>
          <Ionicons name="time-outline" size={24} color={COLORS.primary} />
        </View>
        <Text style={styles.chartTitle}>
          Recent {isExpense ? "Expenses" : "Income"}
        </Text>
      </View>

      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name={isExpense ? "trending-down-outline" : "trending-up-outline"}
            size={48}
            color={COLORS.textLight}
          />
          <Text style={styles.emptyText}>
            No recent {isExpense ? "expenses" : "income"} found
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>
              Add {isExpense ? "Expense" : "Income"}
            </Text>
            <Ionicons name="add-circle" size={16} color={COLORS.primary} />
          </TouchableOpacity>
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
                          ? `${COLORS.expense}15`
                          : `${COLORS.income}15`,
                    },
                  ]}
                >
                  <Ionicons
                    name={getCategoryIcon(transaction.category)}
                    size={20}
                    color={
                      parseFloat(transaction.amount) < 0
                        ? COLORS.expense
                        : COLORS.income
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
                      {formatDate(transaction.created_at)}
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
                          ? COLORS.expense
                          : COLORS.income,
                    },
                  ]}
                >
                  {parseFloat(transaction.amount) < 0 ? "-" : "+"}$
                  {Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                </Text>
                <View style={styles.arrowCircle}>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={16}
                    color={COLORS.white}
                  />
                </View>
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
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </>
      )}
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
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    color: COLORS.text,
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  transactionCategory: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: "italic",
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
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
    gap: 8,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
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
    marginBottom: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}15`,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  addButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    marginRight: 6,
  },
});

export default TransactionsList;
