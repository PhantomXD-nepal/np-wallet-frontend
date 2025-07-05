import React from "react";
import { View, FlatList } from "react-native";
import { TransactionItem } from "./TransactionItem";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: string;
  date: string;
};

type TransactionsListProps = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
};

export const TransactionsList = ({
  transactions,
  onDelete,
}: TransactionsListProps) => {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TransactionItem transaction={item} onDelete={onDelete} />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
};
