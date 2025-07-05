import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";

const categoryIcons = {
  food: "restaurant-outline",
  transport: "car-outline",
  shopping: "bag-outline",
  entertainment: "game-controller-outline",
  utilities: "home-outline",
  health: "medical-outline",
  education: "school-outline",
  salary: "card-outline",
  business: "briefcase-outline",
  other: "ellipsis-horizontal-outline",
};

export const TransactionItem = ({ transaction, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(transaction.id),
        },
      ]
    );
  };

  const isExpense = transaction.type === "expense";
  const amountColor = isExpense ? COLORS.error : COLORS.success;
  const amountPrefix = isExpense ? "-" : "+";

  return (
    <View style={styles.transactionCard}>
      <View style={styles.transactionContent}>
        <View style={styles.categoryIconContainer}>
          <Ionicons
            name={categoryIcons[transaction.category] || categoryIcons.other}
            size={20}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{transaction.title}</Text>
          <Text style={styles.transactionCategory}>
            {transaction.category?.charAt(0).toUpperCase() +
              transaction.category?.slice(1) || "Other"}
          </Text>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[styles.transactionAmount, { color: amountColor }]}>
            {amountPrefix}${Math.abs(transaction.amount).toFixed(2)}
          </Text>
          <Text style={styles.transactionDate}>
            {new Date(transaction.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={18} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );
};
