import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../assets/styles/create.styles";
import { COLORS } from "../../constants/colors";

const TransactionTypeSelector = ({ isExpense, setIsExpense }) => {
  return (
    <View style={styles.typeSelector}>
      {/* EXPENSE SELECTOR */}
      <TouchableOpacity
        style={[styles.typeButton, isExpense && styles.typeButtonActive]}
        onPress={() => setIsExpense(true)}
      >
        <Ionicons
          name="arrow-down-circle"
          size={22}
          color={isExpense ? COLORS.white : COLORS.expense}
          style={styles.typeIcon}
        />
        <Text
          style={[
            styles.typeButtonText,
            isExpense && styles.typeButtonTextActive,
          ]}
        >
          Expense
        </Text>
      </TouchableOpacity>

      {/* INCOME SELECTOR */}
      <TouchableOpacity
        style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
        onPress={() => setIsExpense(false)}
      >
        <Ionicons
          name="arrow-up-circle"
          size={22}
          color={!isExpense ? COLORS.white : COLORS.income}
          style={styles.typeIcon}
        />
        <Text
          style={[
            styles.typeButtonText,
            !isExpense && styles.typeButtonTextActive,
          ]}
        >
          Income
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionTypeSelector;
