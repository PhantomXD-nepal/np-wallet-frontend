import { TouchableOpacity, Text } from "react-native";
import { showModal } from "../extras/customModal";
import { styles } from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { saveOfflineTransaction } from "../../lib/offlineSync";

const CreateOfflineButton = ({ formData, isExpense, isLoading, userId }) => {
  const handleSaveOffline = async () => {
    if (!formData.title || !formData.amount || !formData.category) {
      showModal(
        "Error",
        "Please fill in all required fields",
        [{ text: "OK" }],
        "error",
      );
      return;
    }

    try {
      console.log("Creating offline transaction");
      // Format the amount (negative for expenses, positive for income)
      const formattedAmount = isExpense
        ? -Math.abs(parseFloat(formData.amount))
        : Math.abs(parseFloat(formData.amount));

      const transactionData = {
        user_id: userId,
        title: formData.title,
        amount: formattedAmount,
        category: formData.category,
        created_at: new Date().toISOString(),
      };

      console.log("Offline transaction data:", transactionData);
      await saveOfflineTransaction(transactionData);
      console.log("Transaction saved to offline storage");

      showModal(
        "Saved Offline",
        "Transaction saved locally. It will sync when you reconnect to the internet.",
        [{ text: "OK" }],
        "success",
      );
    } catch (error) {
      console.error("Error saving offline transaction:", error);
      showModal(
        "Error",
        `Failed to save transaction offline: ${error.message}`,
        [{ text: "OK" }],
        "error",
      );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.offlineButton, isLoading && styles.offlineButtonDisabled]}
      onPress={handleSaveOffline}
      disabled={isLoading}
    >
      <Ionicons
        name="cloud-offline-outline"
        size={16}
        color={COLORS.white}
        style={styles.offlineButtonIcon}
      />
      <Text style={styles.offlineButtonText}>Save Offline</Text>
    </TouchableOpacity>
  );
};

export default CreateOfflineButton;
