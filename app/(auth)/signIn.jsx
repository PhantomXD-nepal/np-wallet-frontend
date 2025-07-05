import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import React from "react";
import { styles } from "../../assets/styles/auth.styles";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError("Sign in incomplete. Please try again.");
      }
    } catch (err) {
      // Handle different types of errors
      const errorMessage =
        err?.errors?.[0]?.message || "An error occurred during sign in";
      setError(errorMessage);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Optional: Add an illustration/logo */}
      {/* <Image
        source={require("../../assets/sign-in-illustration.png")}
        style={styles.illustration}
      /> */}

      <Text style={styles.title}>Welcome Back</Text>

      {/* Error display */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TextInput
        style={[styles.input, error && styles.errorInput]}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#999"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        keyboardType="email-address"
        autoComplete="email"
      />

      <TextInput
        style={[styles.input, error && styles.errorInput]}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#999"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        autoComplete="password"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={onSignInPress}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Signing in..." : "Continue"}
        </Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Link href="/signUp">
          <Text style={styles.linkText}>Sign up</Text>
        </Link>
      </View>
    </View>
  );
}
