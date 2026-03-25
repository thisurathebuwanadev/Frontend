import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { SL_MAP } from "../../constants/slLocations";

const INITIAL_REGION = SL_MAP.regions.colombo;

const DRIVER_MARKERS = [
  { id: "driver-1", ...SL_MAP.points.galleFaceGreen },
  { id: "driver-2", ...SL_MAP.points.fortRailwayStation },
  { id: "driver-3", ...SL_MAP.points.bambaJunction },
];

function NativeMap() {
  // Lazy require to avoid loading native-only module on web
  const Maps = require("react-native-maps");
  const MapView = Maps.default;
  const Marker = Maps.Marker;

  return (
    <MapView style={StyleSheet.absoluteFill} initialRegion={INITIAL_REGION}>
      {DRIVER_MARKERS.map((driver) => (
        <Marker
          key={driver.id}
          coordinate={{
            latitude: driver.latitude,
            longitude: driver.longitude,
          }}
          title="Nearby driver"
          description="Available for pickup"
        />
      ))}
    </MapView>
  );
}

export default function PassengerHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greetingTitle}>Good morning,</Text>
          <Text style={styles.greetingSubtitle}>Ready for your next ride?</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="person" size={22} color={colors.white} />
        </View>
      </View>

      <View style={styles.mapContainer}>
        {Platform.OS === "web" ? (
          <View style={styles.webMapPlaceholder}>
            <Ionicons
              name="map-outline"
              size={32}
              color={colors.textSecondary}
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.webMapPlaceholderText}>
              Map preview is available on mobile devices.
            </Text>
          </View>
        ) : (
          <NativeMap />
        )}
      </View>

      <View style={styles.routeCard}>
        <Text style={styles.routeTitle}>Plan your route</Text>

        <View style={styles.inputRow}>
          <Ionicons
            name="location-outline"
            size={18}
            color={colors.primary}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Start location"
            placeholderTextColor={colors.placeholderText}
            style={styles.input}
          />
        </View>

        <View style={styles.inputRow}>
          <Ionicons
            name="flag-outline"
            size={18}
            color={colors.accent}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Destination"
            placeholderTextColor={colors.placeholderText}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate("DriverSearch")}
        >
          <Text style={styles.searchButtonText}>Search rides</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greetingTitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  greetingSubtitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 18,
    overflow: "hidden",
  },
  webMapPlaceholder: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  webMapPlaceholderText: {
    color: colors.mutedTextOnDark,
    fontSize: 14,
    textAlign: "center",
  },
  routeCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  routeTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.textPrimary,
  },
  searchButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
});

