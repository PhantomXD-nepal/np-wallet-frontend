import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { styles } from "../assets/styles/create.styles";
import { useRouter } from "expo-router";

export const Header = ({ onSave, isValid, isLoading }) => {
  const router = useRouter();
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
