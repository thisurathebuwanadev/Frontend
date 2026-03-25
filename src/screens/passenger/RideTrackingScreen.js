import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

// Simple mock coordinates for driver and passenger
const MOCK_COORDS = {
  driver: { lat: 37.78825, lng: -122.4324 },
  passenger: { lat: 37.786, lng: -122.435 },
};

export default function RideTrackingScreen({ route }) {
  const { driver } = route.params ?? {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your driver is on the way</Text>

      <View style={styles.mapPlaceholder}>
        <Ionicons
          name="navigate-outline"
          size={40}
          color={colors.primary}
          style={{ marginBottom: 8 }}
        />
        <Text style={styles.mapText}>
          Live map tracking will appear here when connected to the backend.
        </Text>
        <Text style={styles.mapCoords}>
          Driver: {MOCK_COORDS.driver.lat.toFixed(3)},{" "}
          {MOCK_COORDS.driver.lng.toFixed(3)}
        </Text>
        <Text style={styles.mapCoords}>
          Pickup: {MOCK_COORDS.passenger.lat.toFixed(3)},{" "}
          {MOCK_COORDS.passenger.lng.toFixed(3)}
        </Text>
      </View>

      <View style={styles.driverCard}>
        <View style={styles.driverRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {(driver?.name || "D").charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{driver?.name ?? "Driver name"}</Text>
            <Text style={styles.vehicle}>
              {driver?.vehicle ?? "Vehicle details"}
            </Text>
            <Text style={styles.eta}>ETA: ~5 minutes</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.contactButton}>
          <Ionicons
            name="call-outline"
            size={18}
            color={colors.white}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.contactText}>Contact driver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  mapText: {
    color: colors.textOnDark,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  mapCoords: {
    color: colors.mutedTextOnDark,
    fontSize: 12,
  },
  driverCard: {
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarInitial: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  vehicle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
  },
  eta: {
    marginTop: 4,
    fontSize: 13,
    color: colors.secondary,
  },
  contactButton: {
    marginTop: 4,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  contactText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
});

