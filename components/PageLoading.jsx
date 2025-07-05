import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

const PageLoading = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />

      <Text style={[styles.text, { paddingTop: 10 }]}>Loading...</Text>
    </View>
  );
};

export default PageLoading;
