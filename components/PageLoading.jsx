import React from "react";
import { View, Text } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";
import { ActivityIndicator } from "react-native";

const PageLoading = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />

      <Text style={[styles.text, { paddingTop: 10 }]}>Loading...</Text>
    </View>
  );
};

export default PageLoading;
