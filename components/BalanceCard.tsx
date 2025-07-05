import { View, Text } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

export const BalanceCard = ({ summary }) => {
  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>Total Balance</Text>
      <Text style={styles.balanceAmount}>${summary.balance}</Text>
      <View style={styles.balanceStats}>
        <View style={[styles.balanceStatItem, styles.statDivider]}>
          <Text style={styles.balanceStatLabel}>Income</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.success }]}>
            +${summary.income}
          </Text>
        </View>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Expenses</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.error }]}>
            -${summary.expenses}
          </Text>
        </View>
      </View>
    </View>
  );
};
