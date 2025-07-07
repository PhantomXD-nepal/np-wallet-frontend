import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../assets/styles/create.styles";
import { COLORS } from "../../constants/colors";

const EXPENSE_CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "groceries", name: "Groceries", icon: "basket" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "fuel", name: "Fuel", icon: "speedometer" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "subscriptions", name: "Subscriptions", icon: "tv" },
  { id: "bills", name: "Bills & Utilities", icon: "receipt" },
  { id: "health", name: "Health & Medicine", icon: "medkit" },
  { id: "education", name: "Education", icon: "school" },
  { id: "travel", name: "Travel", icon: "airplane" },
  { id: "home", name: "Home & Rent", icon: "home" },
  { id: "pets", name: "Pet Care", icon: "paw" },
  { id: "donation", name: "Donations", icon: "heart" },
  { id: "tax", name: "Taxes", icon: "document-text" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

const INCOME_CATEGORIES = [
  { id: "salary", name: "Salary", icon: "cash" },
  { id: "freelance", name: "Freelance", icon: "briefcase" },
  { id: "investment", name: "Investment", icon: "trending-up" },
  { id: "gift", name: "Gift", icon: "gift" },
  { id: "rental", name: "Rental Income", icon: "business" },
  { id: "bonus", name: "Bonus", icon: "ribbon" },
  { id: "interest", name: "Interest", icon: "wallet" },
  { id: "dividend", name: "Dividends", icon: "stats-chart" },
  { id: "refund", name: "Refunds", icon: "refresh" },
  { id: "selling", name: "Selling Items", icon: "pricetag" },
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
