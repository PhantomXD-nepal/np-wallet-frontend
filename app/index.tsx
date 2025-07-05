import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { useTransactions } from "../hooks/useTransactions";
import { useEffect } from "react";

export default function Page() {
  const { user } = useUser();
  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransactions(user?.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  console.log(transactions);
  console.log(summary);
  console.log(user?.id);

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/signIn">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/signUp">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  );
}
