import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/colors";
import { fetchDriverRoutes } from "../../services/routeService";

export default function DriverRouteListScreen({ navigation, route }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const res = await fetchDriverRoutes();
      const mapped = (res.data || []).map((r) => ({
        id: r.route_id,
        startLocation: r.start_address,
        destination: r.end_address,
        departureTime: r.departure_time,
        seatsAvailable: r.available_seats,
        status: r.route_status,
      }));
      setRoutes(mapped);
    } catch (e) {
      console.error("Failed to fetch routes", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, [route?.params?.justPublished]);

  const handleViewRequests = () => {
    navigation.navigate("Requests", { screen: "DriverRequests" });
  };

  const handleCancelRoute = (id) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your active routes</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.success} style={{ marginTop: 32 }} />
      ) : (
      <FlatList
        data={routes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.routeTitle}>
              {item.startLocation} → {item.destination}
            </Text>
            <Text style={styles.meta}>
              Departure: {item.departureTime} • Seats: {item.seatsAvailable}
            </Text>
            <Text style={styles.status}>Status: {item.status}</Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleViewRequests}
              >
                <Text style={styles.primaryButtonText}>View requests</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => handleCancelRoute(item.id)}
              >
                <Text style={styles.secondaryButtonText}>Cancel route</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      )}
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
  routeTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  status: {
    fontSize: 13,
    color: colors.accent,
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
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

