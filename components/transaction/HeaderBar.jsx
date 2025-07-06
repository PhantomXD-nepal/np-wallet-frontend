import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../assets/styles/create.styles";
import { COLORS } from "../../constants/colors";

const HeaderBar = ({
  title,
  onBackPress,
  onResetPress,
  onSavePress,
  isLoading,
  isOnline = true,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{title}</Text>

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.resetButton} onPress={onResetPress}>
          <Ionicons name="refresh" size={20} color={COLORS.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButtonContainer,
            isLoading && styles.saveButtonDisabled,
            !isOnline && styles.saveButtonOffline,
          ]}
          onPress={onSavePress}
          disabled={isLoading || !isOnline}
        >
          <Text style={styles.saveButton}>
            {isLoading ? "Saving..." : isOnline ? "Save" : "Offline"}
          </Text>
          {!isLoading && (
            <Ionicons
              name={isOnline ? "checkmark" : "cloud-offline-outline"}
              size={18}
              color={isOnline ? COLORS.primary : COLORS.textLight}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderBar;
