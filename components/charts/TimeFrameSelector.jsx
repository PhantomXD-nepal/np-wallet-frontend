import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const { width: screenWidth } = Dimensions.get("window");

/**
 * TimeFrameSelector - Component for selecting daily, weekly, or monthly time frames
 * @param {string} activeTimeFrame - The currently selected time frame ('daily', 'weekly', or 'monthly')
 * @param {function} onTimeFrameChange - Function to call when time frame is changed
 */
const TimeFrameSelector = ({ activeTimeFrame, onTimeFrameChange }) => {
  const timeFrames = [
    {
      id: "daily",
      label: "Daily",
      icon: "calendar-outline",
    },
    {
      id: "weekly",
      label: "Weekly",
      icon: "calendar-number-outline",
    },
    {
      id: "monthly",
      label: "Monthly",
      icon: "calendar-clear-outline",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.selectorContainer}>
        {timeFrames.map((timeFrame) => (
          <TouchableOpacity
            key={timeFrame.id}
            style={[
              styles.timeFrameButton,
              activeTimeFrame === timeFrame.id && styles.activeTimeFrameButton,
            ]}
            onPress={() => onTimeFrameChange(timeFrame.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={timeFrame.icon}
              size={16}
              color={
                activeTimeFrame === timeFrame.id
                  ? COLORS.white
                  : COLORS.textLight
              }
              style={styles.timeFrameIcon}
            />
            <Text
              style={[
                styles.timeFrameText,
                activeTimeFrame === timeFrame.id && styles.activeTimeFrameText,
              ]}
            >
              {timeFrame.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Math.max(screenWidth * 0.04, 16),
    marginBottom: 16,
  },
  selectorContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: Math.max(screenWidth * 0.01, 3),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeFrameButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Math.max(screenWidth * 0.025, 8),
    paddingHorizontal: Math.max(screenWidth * 0.02, 6),
    borderRadius: 8,
  },
  activeTimeFrameButton: {
    backgroundColor: COLORS.primary,
  },
  timeFrameIcon: {
    marginRight: Math.max(screenWidth * 0.01, 3),
  },
  timeFrameText: {
    fontSize: Math.max(screenWidth * 0.035, 12),
    fontWeight: "600",
    color: COLORS.textLight,
  },
  activeTimeFrameText: {
    color: COLORS.white,
  },
});

export default TimeFrameSelector;
