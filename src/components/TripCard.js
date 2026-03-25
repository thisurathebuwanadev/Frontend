import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { Card } from "./Card";

export function TripCard({ trip }) {
  return (
    <Card style={styles.card}>
      <Text style={styles.route}>{trip.route}</Text>
      <Text style={styles.meta}>{trip.time || trip.date}</Text>
      <View style={styles.footerRow}>
        <Text style={styles.fare}>
          {typeof trip.fare === "number"
            ? `Rs. ${trip.fare}`
            : trip.cost}
        </Text>
        <Text style={styles.status}>{trip.status}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
  },
  route: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
  footerRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fare: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  status: {
    fontSize: 13,
    color: colors.secondary,
  },
});

export default TripCard;

