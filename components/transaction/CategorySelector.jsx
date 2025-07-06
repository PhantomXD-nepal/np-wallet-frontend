import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../assets/styles/create.styles";
import { COLORS } from "../../constants/colors";

const EXPENSE_CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "bills", name: "Bills", icon: "receipt" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

const INCOME_CATEGORIES = [
  { id: "salary", name: "Salary", icon: "cash" },
  { id: "freelance", name: "Freelance", icon: "briefcase" },
  { id: "investment", name: "Investment", icon: "trending-up" },
  { id: "gift", name: "Gift", icon: "gift" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

const CategorySelector = ({
  selectedCategory,
  onSelectCategory,
  error,
  isExpense = true,
}) => {
  // Select the appropriate categories based on transaction type
  const categories = isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <>
      <Text style={styles.sectionTitle}>
        <Ionicons name="pricetag-outline" size={16} color={COLORS.text} />{" "}
        Category
      </Text>

      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.categoryButtonActive,
            ]}
            onPress={() => onSelectCategory(category.name)}
          >
            <Ionicons
              name={category.icon}
              size={20}
              color={
                selectedCategory === category.name ? COLORS.white : COLORS.text
              }
              style={styles.categoryIcon}
            />
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category.name &&
                  styles.categoryButtonTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </>
  );
};

export default CategorySelector;
