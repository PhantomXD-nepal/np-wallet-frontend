import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../assets/styles/create.styles";
import { COLORS } from "../../constants/colors";

const FormField = ({
  icon,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  isDatePicker = false,
  onPress,
}) => {
  return (
    <>
      <View style={styles.inputContainer}>
        <Ionicons
          name={icon}
          size={22}
          color={COLORS.textLight}
          style={styles.inputIcon}
        />
        {isDatePicker ? (
          <TouchableOpacity style={styles.datePickerButton} onPress={onPress}>
            <Text style={styles.dateText}>{value}</Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={[
              styles.input,
              multiline && { height: numberOfLines * 20, textAlignVertical: "top" },
            ]}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textLight}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline={multiline}
            numberOfLines={numberOfLines}
            keyboardType={keyboardType}
          />
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </>
  );
};

export default FormField;
