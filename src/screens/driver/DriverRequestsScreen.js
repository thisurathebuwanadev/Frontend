import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/colors";
import api from "../../services/api";

export default function DriverRequestsScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/rides/incoming")
      .then((res) => setRequests(res.data.data))
      .catch((err) => console.error("Failed to fetch ride requests:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (request) => {
    try {
      await api.post("/rides/accept", { requestId: request.id, action: "accept" });
      navigation.navigate("ActiveTrip", { request });
    } catch (err) {
      console.error("Failed to accept ride:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post("/rides/accept", { requestId: id, action: "reject", reason: "Not available" });
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to reject ride:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incoming requests</Text>

      {loading && <ActivityIndicator size="large" color={colors.accent} />}

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.passengerName}</Text>
            <Text style={styles.meta}>{item.pickupAddress}</Text>
            <Text style={styles.meta}>
              {item.passengerCount} passenger
              {item.passengerCount > 1 ? "s" : ""} • {item.distanceFromDriverKm} km away
            </Text>
            <Text style={styles.fare}>Est. fare Rs. {item.estimatedCost}</Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={() => handleAccept(item)}
              >
                <Text style={styles.primaryButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => handleReject(item.id)}
              >
                <Text style={styles.secondaryButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  fare: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: colors.accent,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: colors.success,
    marginRight: 8,
  },
  primaryButtonText: {
    color: colors.successTextOnDark,
    fontSize: 13,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  secondaryButtonText: {
    color: colors.textOnDark,
    fontSize: 13,
    fontWeight: "500",
  },
});

