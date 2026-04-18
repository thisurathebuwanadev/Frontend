import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import * as Crypto from "expo-crypto";
import { colors } from "../../theme/colors";
import { fetchDriverRoutes, markDriverLocation } from "../../services/routeService";

export default function DriverHomeScreen({ navigation }) {
  const [isOnline, setIsOnline] = React.useState(false);
  const [routes, setRoutes] = React.useState([]);
  const [showRouteModal, setShowRouteModal] = React.useState(false);
  const [loadingRoutes, setLoadingRoutes] = React.useState(false);
  const intervalRef = useRef(null);
  const sessionIdRef = useRef(null);

  const stats = {
    todaysTrips: 5,
    todaysEarnings: 1450,
    passengersServed: 8,
  };

  const handleToggleOnline = async (value) => {
    if (value) {
      try {
        setLoadingRoutes(true);
        setShowRouteModal(true);
        const res = await fetchDriverRoutes();
        setRoutes(res.data);
      } catch (e) {
        console.error("Failed to fetch routes:", e);
        setShowRouteModal(false);
      } finally {
        setLoadingRoutes(false);
      }
    } else {
      setIsOnline(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      sessionIdRef.current = null;
    }
  };

  const sendLocation = async (routeId) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      await markDriverLocation({
        routeId,
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        datetime: new Date().toLocaleString("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).replace("T", " "),
        sessionId: sessionIdRef.current,
      });
    } catch (e) {
      console.error("Failed to mark location:", e);
    }
  };

  const handleSelectRoute = (route) => {
    setShowRouteModal(false);
    setIsOnline(true);
    sessionIdRef.current = Crypto.randomUUID();
    sendLocation(route.route_id);
    intervalRef.current = setInterval(() => sendLocation(route.route_id), 5 * 60 * 1000);
  };

  const handleCreateRoute = () => {
    navigation.navigate("Routes", { screen: "CreateRoute" });
  };

  const handleViewRequests = () => {
    navigation.navigate("Requests", { screen: "DriverRequests" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good afternoon,</Text>
          <Text style={styles.name}>RouteMate Driver</Text>
        </View>
        <View style={styles.statusPill}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isOnline ? colors.success : colors.accent },
            ]}
          />
          <Text style={styles.statusText}>
            {isOnline ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Driver status</Text>
          <Switch
            value={isOnline}
            onValueChange={handleToggleOnline}
            trackColor={{ false: "#4b5563", true: colors.success }}
            thumbColor={colors.white}
          />
        </View>
        <Text style={styles.cardSubtitle}>
          Go online to start receiving ride requests along your routes.
        </Text>
      </View>

      <Modal visible={showRouteModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a route</Text>
            {loadingRoutes ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
            ) : (
              <FlatList
                data={routes}
                keyExtractor={(item) => String(item.route_id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.routeItem}
                    onPress={() => handleSelectRoute(item)}
                  >
                    <Text style={styles.routeText}>
                      {item.start_address} → {item.end_address}
                    </Text>
                    <Text style={styles.routeTime}>Departs: {item.departure_time}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No routes found</Text>
                }
              />
            )}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRouteModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Today&apos;s trips</Text>
          <Text style={styles.statValue}>{stats.todaysTrips}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Today&apos;s earnings</Text>
          <Text style={styles.statValue}>Rs. {stats.todaysEarnings}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Passengers served</Text>
          <Text style={styles.statValue}>{stats.passengersServed}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.primaryButton, styles.fullWidthButton]}
          onPress={handleCreateRoute}
        >
          <Text style={styles.primaryButtonText}>Create route</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, styles.fullWidthButton]}
          onPress={handleViewRequests}
        >
          <Text style={styles.secondaryButtonText}>View requests</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "500",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  actions: {
    marginTop: "auto",
  },
  primaryButton: {
    backgroundColor: colors.success,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.success,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: colors.successTextOnDark,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  secondaryButtonText: {
    color: colors.textOnDark,
    fontSize: 15,
    fontWeight: "500",
  },
  fullWidthButton: {
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  routeItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  routeText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  routeTime: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginVertical: 20,
  },
  cancelButton: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.accent,
  },
});

