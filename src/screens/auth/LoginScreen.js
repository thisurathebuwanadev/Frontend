import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { useAuth } from "../../hooks/useAuth";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";

export default function LoginScreen({ navigation }) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Login Error", "Please enter email and password.");
      return;
    }

    try {
      await login({ email: email.trim(), password });
      // Role-based navigation is handled by RootNavigator after login.
    } catch (error) {
      Alert.alert("Login Error", error.message || "Unable to login.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>R</Text>
          </View>
          <Text style={styles.title}>RouteMate</Text>
          <Text style={styles.subtitle}>Smart rides, simple routes</Text>
        </View>

        <View style={styles.form}>
          <AppInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <AppInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <AppButton
            title={loading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            loading={loading}
            style={styles.primaryButton}
          />

          <AppButton
            title="Create an account"
            onPress={() => navigation.navigate("Register")}
            variant="outline"
            style={styles.secondaryButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBackground,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.darkBackground,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textOnDark,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.mutedTextOnDark,
    textAlign: "center",
  },
  form: {
    marginTop: 4,
  },
  primaryButton: {
    marginTop: 4,
  },
  secondaryButton: {
    marginTop: 14,
  },
});

