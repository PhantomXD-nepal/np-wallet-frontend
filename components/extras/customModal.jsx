import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const SCREEN_HEIGHT = Dimensions.get("window").height;

/**
 * CustomModal component to replace all Alert.alert instances
 *
 * @param {boolean} visible - Controls modal visibility
 * @param {function} onClose - Function to call when modal is closed
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 * @param {Array} buttons - Array of button objects with text, style, and onPress properties
 * @param {string} type - "success", "error", "warning", "info", or "confirm" (default: "info")
 */
const CustomModal = ({
  visible,
  onClose,
  title,
  message,
  buttons = [{ text: "OK", onPress: () => {} }],
  type = "info",
}) => {
  const animation = new Animated.Value(0);

  // Define colors and icons based on type
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          color: COLORS.income,
          icon: "checkmark-circle",
        };
      case "error":
        return {
          color: COLORS.expense,
          icon: "alert-circle",
        };
      case "warning":
        return {
          color: "#FFA500", // Orange color for warning
          icon: "warning",
        };
      case "confirm":
        return {
          color: COLORS.primary,
          icon: "help-circle",
        };
      case "info":
      default:
        return {
          color: COLORS.primary,
          icon: "information-circle",
        };
    }
  };

  const typeStyles = getTypeStyles();

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Animate out
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  });

  // Animation styles
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={typeStyles.icon}
              size={40}
              color={typeStyles.color}
            />
          </View>

          <Text style={styles.title}>{title}</Text>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => {
              // Determine button style based on button.style property
              let buttonStyle = styles.button;
              let textStyle = styles.buttonText;

              if (button.style === "cancel") {
                buttonStyle = styles.cancelButton;
                textStyle = styles.cancelButtonText;
              } else if (button.style === "destructive") {
                buttonStyle = styles.destructiveButton;
                textStyle = styles.destructiveButtonText;
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    buttonStyle,
                    index > 0 && styles.buttonMargin,
                    buttons.length === 1 && styles.singleButton,
                  ]}
                  onPress={() => {
                    if (button.onPress) button.onPress();
                    if (!button.preventClose) onClose();
                  }}
                >
                  <Text style={textStyle}>{button.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    minWidth: 100,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  destructiveButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.expense,
    minWidth: 100,
    alignItems: "center",
    flex: 1,
  },
  destructiveButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 100,
    alignItems: "center",
    flex: 1,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonMargin: {
    marginLeft: 10,
  },
  singleButton: {
    maxWidth: 200,
  },
});

// Create a utility function to use instead of Alert.alert
export const showModal = (
  title,
  message,
  buttons = [{ text: "OK" }],
  type = "info",
) => {
  // This will be implemented in the Modal Provider
  if (global.showCustomModal) {
    global.showCustomModal({
      title,
      message,
      buttons,
      type,
    });
  } else {
    console.warn("CustomModal provider not initialized");
  }
};

export default CustomModal;
