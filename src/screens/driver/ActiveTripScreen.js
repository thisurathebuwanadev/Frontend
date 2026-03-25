import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import MapPreview from "../../components/MapPreview";
import { SL_MAP } from "../../constants/slLocations";

const INITIAL_REGION = SL_MAP.regions.colombo;

export default function ActiveTripScreen({ route }) {
  const { request } = route.params || {};
  const [tripStatus, setTripStatus] = useState("awaiting_pickup");

  // Simulate GPS updates by toggling status over time (placeholder only)
  useEffect(() => {
    let timer;
    if (tripStatus === "in_progress") {
      timer = setTimeout(() => setTripStatus("in_progress"), 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [tripStatus]);

  const handleStartTrip = () => setTripStatus("in_progress");
  const handleEndTrip = () => setTripStatus("completed");

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapPreview region={INITIAL_REGION}>
          {/* Markers would be added here when wiring real coordinates. */}
        </MapPreview>
      </View>

      <View style={styles.bottomCard}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Active trip</Text>
          <View style={styles.statusPill}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    tripStatus === "completed"
                      ? colors.accent
                      : tripStatus === "in_progress"
                      ? colors.success
                      : colors.placeholderText,
                },
              ]}
            />
            <Text style={styles.statusText}>
              {tripStatus === "awaiting_pickup"
                ? "Awaiting pickup"
                : tripStatus === "in_progress"
                ? "In progress"
                : "Completed"}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Ionicons name="person-circle-outline" size={24} color={colors.white} />
          <View style={styles.rowText}>
            <Text style={styles.label}>Passenger</Text>
            <Text style={styles.value}>
              {request?.passengerName ?? "Demo passenger"}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={22} color={colors.accent} />
          <View style={styles.rowText}>
            <Text style={styles.label}>Pickup</Text>
            <Text style={styles.value}>
              {request?.pickupLocation ?? "Pickup location along your route"}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Ionicons name="speedometer-outline" size={22} color={colors.secondary} />
          <View style={styles.rowText}>
            <Text style={styles.label}>Estimated distance</Text>
            <Text style={styles.value}>
              {request?.distanceFromDriverKm
                ? `${request.distanceFromDriverKm} km`
                : "Approx. 6.5 km"}
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              tripStatus !== "awaiting_pickup" && styles.disabledButton,
            ]}
            disabled={tripStatus !== "awaiting_pickup"}
            onPress={handleStartTrip}
          >
            <Text style={styles.secondaryButtonText}>Start trip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              tripStatus === "completed" && styles.disabledButton,
            ]}
            disabled={tripStatus === "completed"}
            onPress={handleEndTrip}
          >
            <Text style={styles.primaryButtonText}>End trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 18,
    overflow: "hidden",
  },
  bottomCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.background,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  rowText: {
    marginLeft: 10,
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: colors.success,
    marginLeft: 8,
  },
  primaryButtonText: {
    color: colors.successTextOnDark,
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginRight: 8,
  },
  secondaryButtonText: {
    color: colors.textOnDark,
    fontSize: 14,
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

