import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { styles } from "../assets/styles/create.styles";

export const TypeSelector = ({ selectedType, onTypeChange }) => {
  return (
    <View style={styles.typeSelector}>
      <TouchableOpacity
        style={[
          styles.typeButton,
          selectedType === "expense" && styles.typeButtonActive,
        ]}
        onPress={() => onTypeChange("expense")}
      >
        <Ionicons
          name="remove-circle-outline"
          size={20}
          color={selectedType === "expense" ? COLORS.white : COLORS.error}
          style={styles.typeIcon}
        />
        <Text
          style={[
            styles.typeButtonText,
            selectedType === "expense" && styles.typeButtonTextActive,
          ]}
        >
          Expense
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.typeButton,
          selectedType === "income" && styles.typeButtonActive,
        ]}
        onPress={() => onTypeChange("income")}
      >
        <Ionicons
          name="add-circle-outline"
          size={20}
          color={selectedType === "income" ? COLORS.white : COLORS.success}
          style={styles.typeIcon}
        />
        <Text
          style={[
            styles.typeButtonText,
            selectedType === "income" && styles.typeButtonTextActive,
          ]}
        >
          Income
        </Text>
      </TouchableOpacity>
    </View>
  );
};
