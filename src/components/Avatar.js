import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export function Avatar({ name, size = 40 }) {
  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "";

  const radius = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: radius }]}>
      {initials ? (
        <Text style={styles.initials}>{initials}</Text>
      ) : (
        <Ionicons name="person" size={size * 0.55} color={colors.white} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: colors.white,
    fontWeight: "700",
  },
});

export default Avatar;

