import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { Card } from "./Card";

export function DriverCard({ driver }) {
  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{driver.name}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={colors.accent} />
          <Text style={styles.ratingText}>{driver.trustScore?.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.vehicle}>{driver.vehicle}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{driver.availableSeats} seats</Text>
        <Text style={styles.meta}>{driver.departureTime}</Text>
        <Text style={styles.meta}>{driver.pickupDistance} away</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  vehicle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default DriverCard;

