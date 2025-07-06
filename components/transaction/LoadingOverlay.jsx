import { View, Text, ActivityIndicator } from "react-native";
import { styles } from "../../assets/styles/create.styles";
import { COLORS } from "../../constants/colors";

const LoadingOverlay = ({ message = "Creating transaction..." }) => {
  return (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </View>
  );
};

export default LoadingOverlay;
