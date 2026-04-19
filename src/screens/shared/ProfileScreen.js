import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../../components/Avatar";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { currentUser, logout } = useAuth();
  const [role, setRole] = useState(currentUser?.role ?? "passenger");
  const [displayName, setDisplayName] = useState(currentUser?.name ?? "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [seatsAvailable, setSeatsAvailable] = useState("");

  useEffect(() => {
    if (currentUser?.role) {
      setRole(currentUser.role);
    }
  }, [currentUser]);

  const handleSave = () => {
    // TEMPORARY PROFILE SAVE
    // This is a no-op for now. When backend/profile storage is ready,
    // replace this with a call to a user/profile service.
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Avatar name={displayName || currentUser?.email} size={64} />
          <View style={styles.headerText}>
            <Text style={styles.fullName}>
              {displayName || currentUser?.name || "RouteMate user"}
            </Text>
            <Text style={styles.roleText}>
              {role === "driver" ? "Driver" : "Passenger"}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>User information</Text>

          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Amaya Senanayake"
            placeholderTextColor={colors.placeholderText}
            value={displayName}
            onChangeText={setDisplayName}
          />

          <Text style={styles.label}>Email</Text>
          <Text style={styles.readOnlyValue}>
            {currentUser?.email ?? "Not signed in"}
          </Text>

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

        {role === "driver" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Driver information</Text>

            <Text style={styles.label}>Vehicle type</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Car, Van"
              placeholderTextColor={colors.placeholderText}
              value={vehicleType}
              onChangeText={setVehicleType}
            />

            <Text style={styles.label}>Vehicle model</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Toyota Prius 2018"
              placeholderTextColor={colors.placeholderText}
              value={vehicleModel}
              onChangeText={setVehicleModel}
            />

            <Text style={styles.label}>Seats available</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 3"
              placeholderTextColor={colors.placeholderText}
              value={seatsAvailable}
              onChangeText={setSeatsAvailable}
              keyboardType="number-pad"
            />
          </View>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
          <Text style={styles.primaryButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerText: {
    marginLeft: 16,
  },
  fullName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  roleText: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  sectionTitleSpaced: {
    marginTop: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: 6,
  },
  readOnlyValue: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    color: colors.textPrimary,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: colors.success,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.success,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.successTextOnDark,
    fontSize: 16,
    fontWeight: "700",
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});

