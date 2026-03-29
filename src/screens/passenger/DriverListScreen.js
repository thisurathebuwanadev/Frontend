import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export default function DriverListScreen({ route, navigation }) {
  const { results = [], criteria } = route.params ?? {};

  const handleRequestRide = (selectedRoute) => {
    navigation.navigate("RideRequest", { selectedRoute, criteria });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available drivers</Text>
      {criteria && (
        <Text style={styles.subtitle}>
          {criteria.start || "Your location"} →{" "}
          {criteria.destination || "Destination"}
        </Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.vehicle}>{item.vehicle}</Text>
                <View style={styles.metaRow}>
                  <Ionicons
                    name="star"
                    size={14}
                    color={colors.accent}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.metaText}>
                    {item.trustScore} • {item.availableSeats} seats • Rs.{item.costPerPassenger}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons
                    name="navigate-outline"
                    size={14}
                    color={colors.secondary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.metaText}>
                    {item.pickupDistance} km • {item.departureTime}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleRequestRide(item)}
            >
              <Text style={styles.buttonText}>Request ride</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarInitial: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  vehicle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  button: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
});

