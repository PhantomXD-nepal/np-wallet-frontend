import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, DEFAULT_THEME } from "../constants/colors";

export default function SafeScreen({ children }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: COLORS.background,
      }}
    >
      {children}
    </View>
  );
}
