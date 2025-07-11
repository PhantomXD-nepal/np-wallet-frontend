import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import CustomModal from "./customModal";

/**
 * ModalProvider component
 * Provides a global modal system for the app
 * Wrap your app with this provider to use the custom modal
 */
export const ModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    buttons: [{ text: "OK" }],
    type: "info",
  });

  // Method to show modal
  const showModal = useCallback((config) => {
    setModalConfig(config);
    setModalVisible(true);
  }, []);

  // Method to hide modal
  const hideModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // Set up global method for showing modals from anywhere
  useEffect(() => {
    global.showCustomModal = showModal;

    return () => {
      global.showCustomModal = undefined;
    };
  }, [showModal]);

  return (
    <View style={styles.container}>
      {children}
      <CustomModal
        visible={modalVisible}
        onClose={hideModal}
        title={modalConfig.title}
        message={modalConfig.message}
        buttons={modalConfig.buttons}
        type={modalConfig.type}
      />
    </View>
  );
};

// Create a hook for using the modal within components
export const useModal = () => {
  const showModal = useCallback(
    (title, message, buttons = [{ text: "OK" }], type = "info") => {
      if (global.showCustomModal) {
        global.showCustomModal({
          title,
          message,
          buttons,
          type,
        });
      } else {
        console.warn("ModalProvider not initialized");
      }
    },
    []
  );

  return { showModal };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ModalProvider;
