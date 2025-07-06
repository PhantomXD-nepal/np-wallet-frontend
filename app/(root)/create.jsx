import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useState, useEffect, useRef } from "react";
import { API_URL } from "../../constants/api";
import { styles } from "../../assets/styles/create.styles";

import { Animated } from "react-native";

// Import Components
import AmountInput from "../../components/transaction/AmountInput";
import CategorySelector from "../../components/transaction/CategorySelector";
import FormField from "../../components/transaction/FormField";
import HeaderBar from "../../components/transaction/HeaderBar";
import LoadingOverlay from "../../components/transaction/LoadingOverlay";
import TransactionTypeSelector from "../../components/transaction/TransactionTypeSelector";

const CreateScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useUser();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
  });

  // UI state
  const [isExpense, setIsExpense] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({
    title: "",
    amount: "",
    category: "",
  });

  // Fade in animation when component mounts and update navigation header
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Hide back button when using tab navigation
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate a specific field
  const validateField = (field) => {
    let isValid = true;

    switch (field) {
      case "title":
        if (!formData.title.trim()) {
          setErrors((prev) => ({ ...prev, title: "Title is required" }));
          isValid = false;
        }
        break;
      case "amount":
        if (
          !formData.amount ||
          isNaN(parseFloat(formData.amount)) ||
          parseFloat(formData.amount) <= 0
        ) {
          setErrors((prev) => ({ ...prev, amount: "Enter a valid amount" }));
          isValid = false;
        }
        break;
      case "category":
        if (!formData.category) {
          setErrors((prev) => ({
            ...prev,
            category: "Please select a category",
          }));
          isValid = false;
        }
        break;
    }

    return isValid;
  };

  // Validate all fields
  const validateForm = () => {
    const titleValid = validateField("title");
    const amountValid = validateField("amount");
    const categoryValid = validateField("category");

    return titleValid && amountValid && categoryValid;
  };

  // Submit transaction
  const handleCreate = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Format the amount (negative for expenses, positive for income)
      const formattedAmount = isExpense
        ? -Math.abs(parseFloat(formData.amount))
        : Math.abs(parseFloat(formData.amount));

      const transactionData = {
        user_id: user.id,
        title: formData.title,
        amount: formattedAmount,
        category: formData.category,
      };

      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create transaction");
      }

      // Show success message
      Alert.alert("Success", "Transaction created successfully");

      // Wait for 1.5 seconds before navigating back
      // The loading indicator will remain visible during this time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.replace("/");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create transaction");
      console.error("Error creating transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    Alert.alert("Reset Form", "Are you sure you want to clear all fields?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setFormData({
            title: "",
            amount: "",
            category: "",
          });
          setErrors({
            title: "",
            amount: "",
            category: "",
          });
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <HeaderBar
          title="New Transaction"
          onBackPress={() => router.replace("/")}
          onResetPress={resetForm}
          onSavePress={handleCreate}
          isLoading={isLoading}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {/* Transaction Type Selector */}
            <TransactionTypeSelector
              isExpense={isExpense}
              setIsExpense={setIsExpense}
            />

            {/* Amount Input */}
            <AmountInput
              amount={formData.amount}
              onChange={(value) => handleChange("amount", value)}
              onBlur={() => validateField("amount")}
              error={errors.amount}
            />

            {/* Title Input */}
            <FormField
              icon="create-outline"
              placeholder="Transaction Title"
              value={formData.title}
              onChange={(value) => handleChange("title", value)}
              onBlur={() => validateField("title")}
              error={errors.title}
            />

            {/* Category Selector */}
            <CategorySelector
              selectedCategory={formData.category}
              onSelectCategory={(category) =>
                handleChange("category", category)
              }
              error={errors.category}
              isExpense={isExpense}
            />
          </View>
        </ScrollView>

        {/* Loading Overlay */}
        {isLoading && (
          <LoadingOverlay
            message={
              formData.title
                ? `Creating "${formData.title}" transaction...`
                : "Creating transaction..."
            }
          />
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default CreateScreen;
