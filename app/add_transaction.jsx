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

import { Header } from "../components/AddTransactionHeader.jsx";
import { AmountInput } from "../components/AmountInput.jsx";
import { CategorySelector } from "../components/CategorySelector.jsx";
import { TypeSelector } from "../components/TypeSelector.jsx";

const API_URL = "https://np-wallet-backend.onrender.com/api";

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
        type, // Add the type field
      };

      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const responseData = await response.json();

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
