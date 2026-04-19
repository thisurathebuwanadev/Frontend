import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export default function ManageDocumentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Documents</Text>
      <Text style={styles.placeholder}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 48, paddingHorizontal: 16 },
  title: { fontSize: 20, fontWeight: "700", color: colors.textPrimary, marginBottom: 16 },
  placeholder: { fontSize: 14, color: colors.textSecondary, textAlign: "center", marginTop: 40 },
});
