import { View, Text, TextInput } from "react-native";
import { useRef } from "react";
import { styles } from "../../assets/styles/create.styles";
import { COLORS } from "../../constants/colors";

const AmountInput = ({ amount, onChange, onBlur, error }) => {
  const amountInputRef = useRef(null);

  return (
    <>
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          ref={amountInputRef}
          style={styles.amountInput}
          placeholder="0.00"
          placeholderTextColor={COLORS.textLight}
          value={amount}
          onChangeText={onChange}
          onBlur={onBlur}
          keyboardType="numeric"
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </>
  );
};

export default AmountInput;
