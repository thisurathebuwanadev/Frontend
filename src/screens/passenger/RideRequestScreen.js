import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { createRideRequest } from "../../services/rideService";

export default function RideRequestScreen({ route, navigation }) {
  const { driver, criteria } = route.params ?? {};

  const handleSendRequest = async () => {
    try {
      console.log("Driver:" + driver.routeId)
      console.log("criteria:" + criteria.pickupLatitude)
      await createRideRequest({
        routeId: driver.routeId,
        pickupLatitude: criteria?.pickupLatitude,
        pickupLongitude: criteria?.pickupLongitude,
        pickupAddress: criteria?.start,
        passengerCount: Number(criteria?.passengers) || 1,
      });
      navigation.navigate("RideTracking", { driver, criteria });
    } catch (error) {
      console.error("Failed to create ride request:", error);
    }
  };

  if (!driver) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No driver selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm ride</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {driver.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{driver.name}</Text>
            <Text style={styles.vehicle}>{driver.vehicle}</Text>
            <Text style={styles.meta}>
              {driver.trustScore ?? 4.8} • {driver.availableSeats ?? 3} seats
              available
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name="location-outline"
            size={18}
            color={colors.primary}
            style={styles.detailIcon}
          />
          <Text style={styles.detailText}>
            {criteria?.start || "Your location"} →{" "}
            {criteria?.destination || "Destination"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name="time-outline"
            size={18}
            color={colors.secondary}
            style={styles.detailIcon}
          />
          <Text style={styles.detailText}>
            {criteria?.timeWindow || driver.departureTime || "Flexible time"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name="people-outline"
            size={18}
            color={colors.secondary}
            style={styles.detailIcon}
          />
          <Text style={styles.detailText}>
            {criteria?.passengers || "1"} passenger
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Estimated cost</Text>
          <Text style={styles.priceValue}>Rs. 380</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleSendRequest}>
        <Text style={styles.primaryButtonText}>Send ride request</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  priceRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  primaryButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

