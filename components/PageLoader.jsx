import { View, ActivityIndicator, TextBase, Text } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

const PageLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text>Syncing Offile Transactions .....</Text>
    </View>
  );
};
export default PageLoader;
