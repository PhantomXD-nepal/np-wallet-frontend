import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { styles } from "@/assets/styles/create.styles";
import { COLORS } from "@/constants/colors";

const API_URL = "https://np-wallet-backend.onrender.com/api";

// Categories for income and expenses
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

const Header = ({ onSave, isValid, isLoading }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Add Transaction</Text>

      <TouchableOpacity
        style={[
          styles.saveButtonContainer,
          (!isValid || isLoading) && styles.saveButtonDisabled,
        ]}
        onPress={onSave}
        disabled={!isValid || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <>
            <Ionicons name="checkmark" size={20} color={COLORS.primary} />
            <Text style={styles.saveButton}>Save</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const TypeSelector = ({ selectedType, onTypeChange }) => {
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

const AmountInput = ({ amount, onAmountChange }) => {
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

const CategorySelector = ({ type, selectedCategory, onCategoryChange }) => {
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

export default function CreateTransactionPage() {
  const { user } = useUser();
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountChange = (text) => {
    // Allow only numbers and decimal point
    const numericText = text.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericText.split(".");
    if (parts.length > 2) {
      return;
    }

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    setAmount(numericText);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(""); // Reset category when type changes
  };

  const isValid = () => {
    return (
      title.trim() && amount && parseFloat(amount) > 0 && category && user?.id
    );
  };

  const handleSave = async () => {
    if (!isValid()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const transactionData = {
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        user_id: user.id,
      };

      // Debug logging
      console.log("Sending transaction data:", transactionData);

      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save transaction");
      }

      Alert.alert("Success", "Transaction saved successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error saving transaction:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to save transaction. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header onSave={handleSave} isValid={isValid()} isLoading={isLoading} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <TypeSelector selectedType={type} onTypeChange={handleTypeChange} />

          <AmountInput amount={amount} onAmountChange={handleAmountChange} />

          <View style={styles.inputContainer}>
            <Ionicons
              name="text-outline"
              size={20}
              color={COLORS.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Transaction title"
              placeholderTextColor={COLORS.textLight}
              maxLength={50}
            />
          </View>

          <CategorySelector
            type={type}
            selectedCategory={category}
            onCategoryChange={setCategory}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
