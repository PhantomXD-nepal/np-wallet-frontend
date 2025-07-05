import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { styles } from "../assets/styles/create.styles";

const incomeCategories = [
  { id: "salary", name: "Salary", icon: "card-outline" },
  { id: "business", name: "Business", icon: "briefcase-outline" },
  { id: "freelance", name: "Freelance", icon: "laptop-outline" },
  { id: "investment", name: "Investment", icon: "trending-up-outline" },
  { id: "rental", name: "Rental", icon: "home-outline" },
  { id: "gift", name: "Gift", icon: "gift-outline" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal-outline" },
];

const expenseCategories = [
  { id: "food", name: "Food", icon: "restaurant-outline" },
  { id: "transport", name: "Transport", icon: "car-outline" },
  { id: "shopping", name: "Shopping", icon: "bag-outline" },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "game-controller-outline",
  },
  { id: "utilities", name: "Utilities", icon: "flash-outline" },
  { id: "health", name: "Health", icon: "medical-outline" },
  { id: "education", name: "Education", icon: "school-outline" },
  { id: "rent", name: "Rent", icon: "home-outline" },
  { id: "insurance", name: "Insurance", icon: "shield-outline" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal-outline" },
];

export const CategorySelector = ({
  type,
  selectedCategory,
  onCategoryChange,
}) => {
  const categories = type === "income" ? incomeCategories : expenseCategories;

  return (
    <View>
      <Text style={styles.sectionTitle}>
        <Ionicons name="grid-outline" size={20} color={COLORS.text} /> Category
      </Text>
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => onCategoryChange(category.id)}
          >
            <Ionicons
              name={category.icon}
              size={16}
              color={
                selectedCategory === category.id ? COLORS.white : COLORS.primary
              }
              style={styles.categoryIcon}
            />
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category.id &&
                  styles.categoryButtonTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
