import React from "react";
import { View, Text, TextInput } from "react-native";
import { COLORS } from "../constants/colors";
import { styles } from "../assets/styles/create.styles";

export const AmountInput = ({ amount, onAmountChange }) => {
  return (
    <View style={styles.amountContainer}>
      <Text style={styles.currencySymbol}>$</Text>
      <TextInput
        style={styles.amountInput}
        value={amount}
        onChangeText={onAmountChange}
        placeholder="0.00"
        keyboardType="numeric"
        placeholderTextColor={COLORS.textLight}
        maxLength={10}
      />
    </View>
  );
};
