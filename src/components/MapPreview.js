import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { SL_MAP } from "../constants/slLocations";

const DEFAULT_REGION = SL_MAP.regions.colombo;

export function MapPreview({ region = DEFAULT_REGION, children }) {
  if (Platform.OS === "web") {
    return (
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
    );
  }

  // Lazy require to avoid loading native-only module on web
  const Maps = require("react-native-maps");
  const MapView = Maps.default;

  return (
    <MapView style={StyleSheet.absoluteFill} initialRegion={region}>
      {children}
    </MapView>
  );
}

const styles = StyleSheet.create({
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
});

export default MapPreview;

