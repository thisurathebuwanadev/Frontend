import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { useAuth } from "../../hooks/useAuth";

export default function EditProfileScreen({ route }) {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const profile = route?.params?.profile;
  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [lastName, setLastName] = useState(profile?.lastName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber ?? currentUser?.phone ?? "");

  const handleSave = () => {
    // TODO: call profile update API
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Edit Profile</Text>

        <View style={styles.card}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Amaya"
            placeholderTextColor={colors.placeholderText}
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Senanayake"
            placeholderTextColor={colors.placeholderText}
            value={lastName}
            onChangeText={setLastName}
          />

          <Text style={styles.label}>Email</Text>
          <Text style={styles.readOnlyValue}>{profile?.email ?? currentUser?.email ?? "Not signed in"}</Text>

          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            placeholder="+94 71 234 5678"
            placeholderTextColor={colors.placeholderText}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: "700", color: colors.textPrimary, marginBottom: 20 },
  card: {
    backgroundColor: colors.white, borderRadius: 20, padding: 24, marginBottom: 24,
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 10 }, elevation: 6,
  },
  label: { fontSize: 13, fontWeight: "500", color: colors.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.divider, color: colors.textPrimary,
    paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, marginBottom: 16, fontSize: 16,
  },
  readOnlyValue: {
    fontSize: 16, color: colors.textPrimary, marginBottom: 16, paddingVertical: 10, paddingHorizontal: 14,
    backgroundColor: colors.background, borderRadius: 12, borderWidth: 1, borderColor: colors.inputBorder,
  },
  saveButton: {
    backgroundColor: colors.success, paddingVertical: 14, borderRadius: 999, alignItems: "center",
    shadowColor: colors.success, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  saveButtonText: { color: colors.successTextOnDark, fontSize: 16, fontWeight: "700" },
});
