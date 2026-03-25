import React from "react";
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "../theme/colors";

export function AppButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  style,
}) {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";

  const backgroundColor = isPrimary
    ? colors.success
    : isOutline
    ? "transparent"
    : colors.cardBackground;

  const textColor = isPrimary
    ? colors.successTextOnDark
    : isOutline
    ? colors.textOnDark
    : colors.textOnDark;

  const borderColor = isPrimary ? colors.success : colors.inputBorder;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor, borderColor }, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: colors.success,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default AppButton;

