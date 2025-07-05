import * as React from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { styles } from "../../assets/styles/auth.styles"; // Adjust the import path as needed

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });
      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // Handle different types of errors
      const errorMessage =
        err?.errors?.[0]?.message || "An error occurred during sign up";
      setError(errorMessage);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
        setError("Verification incomplete. Please try again.");
      }
    } catch (err) {
      // Handle different types of errors
      const errorMessage =
        err?.errors?.[0]?.message || "Invalid verification code";
      setError(errorMessage);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>
        <Text style={styles.footerText}>
          We've sent a verification code to {emailAddress}
        </Text>

        {/* Error display */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#999"
          onChangeText={(code) => setCode(code)}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={onVerifyPress}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Optional: Add an illustration/logo */}
      {/* <Image
        source={require("../../assets/sign-up-illustration.png")}
        style={styles.illustration}
      /> */}

      <Text style={styles.title}>Create Account</Text>

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
        onChangeText={(email) => setEmailAddress(email)}
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
        onPress={onSignUpPress}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Creating Account..." : "Continue"}
        </Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Link href="/signIn">
          <Text style={styles.linkText}>Sign in</Text>
        </Link>
      </View>
    </View>
  );
}
