import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
} from "react-native";
import { colors } from "../../theme/colors";

export default function DriverHomeScreen({ navigation }) {
  const [isOnline, setIsOnline] = React.useState(false);

  const stats = {
    todaysTrips: 5,
    todaysEarnings: 1450,
    passengersServed: 8,
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
            onValueChange={setIsOnline}
            trackColor={{ false: "#4b5563", true: colors.success }}
            thumbColor={colors.white}
          />
        </View>
        <Text style={styles.cardSubtitle}>
          Go online to start receiving ride requests along your routes.
        </Text>
      </View>

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
});

