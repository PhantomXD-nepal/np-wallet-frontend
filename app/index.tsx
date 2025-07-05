import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { useTransactions } from "../hooks/useTransactions";
import PageLoading from "../components/PageLoading";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

import { Header } from "../components/Header";
import { BalanceCard } from "../components/BalanceCard";
import { TransactionItem } from "../components/TransactionItem";
import { EmptyState } from "../components/EmptyState";

// Category icons mapping

export default function Page() {
  const { user } = useUser();
  const {
    transactions,
    summary,
    isLoading,
    error,
    loadData,
    deleteTransaction,
  } = useTransactions(user?.id);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  if (isLoading) return <PageLoading />;
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.headerTitle}>Error loading data</Text>
        <TouchableOpacity style={styles.addButton} onPress={loadData}>
          <Text style={styles.addButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SignedIn>
        <View style={styles.content}>
          <Header user={user} />
          <BalanceCard summary={summary} />

          <View style={[styles.transactionsHeaderContainer, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {transactions.length > 0 && (
              <Link href="/" asChild>
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
              item.id.toString() || Math.random().toString()
            }
            renderItem={({ item }) => (
              <TransactionItem
                transaction={item}
                onDelete={deleteTransaction}
              />
            )}
            style={[styles.transactionsList, { flex: 1 }]}
            contentContainerStyle={[
              styles.transactionsListContent,
              { paddingTop: 10 },
            ]}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SignedIn>

      <SignedOut>
        <View style={[styles.loadingContainer, { padding: 20 }]}>
          <Text style={[styles.headerTitle, { marginBottom: 10 }]}>
            Welcome to Expense Tracker
          </Text>
          <Text style={[styles.welcomeText, { marginBottom: 20 }]}>
            Please sign in to continue
          </Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity
              style={[styles.addButton, { paddingHorizontal: 30 }]}
              onPress={() => {
                /* Sign in handled by Clerk */
              }}
            >
              <Text style={styles.addButtonText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SignedOut>
    </View>
  );
}
