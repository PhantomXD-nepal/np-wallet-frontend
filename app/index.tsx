import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "../hooks/useTransactions";
import PageLoading from "../components/PageLoading";
import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";

import { Header } from "../components/Header";
import { BalanceCard } from "../components/BalanceCard";
import { TransactionItem } from "../components/TransactionItem";
import { EmptyState } from "../components/EmptyState";

// Category icons mapping

export default function Page() {
  const { user } = useUser();
  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransactions(user?.id);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [loadData, user?.id]);

  if (isLoading) return <PageLoading />;

  return (
    <View style={styles.container}>
      <SignedIn>
        <View style={styles.content}>
          <Header user={user} />
          <BalanceCard summary={summary} />

          <View style={styles.transactionsHeaderContainer}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {transactions.length > 0 && (
              <Link href="/transactions" asChild>
                <TouchableOpacity>
                  <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                    View All
                  </Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.content}>
            <EmptyState />
          </View>
        ) : (
          <FlatList
            data={transactions.slice(0, 10)} // Show only recent 10 transactions
            keyExtractor={(item) =>
              item.id?.toString() || Math.random().toString()
            }
            renderItem={({ item }) => (
              <TransactionItem
                transaction={item}
                onDelete={deleteTransaction}
              />
            )}
            style={styles.transactionsList}
            contentContainerStyle={styles.transactionsListContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SignedIn>

      <SignedOut>
        <View style={styles.loadingContainer}>
          <Text style={styles.headerTitle}>Welcome to Expense Tracker</Text>
          <Text style={styles.welcomeText}>Please sign in to continue</Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SignedOut>
    </View>
  );
}
