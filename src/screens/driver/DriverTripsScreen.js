import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/colors";
import { mockDriverTrips } from "../../data/mockDriverTrips";

const TABS = ["Upcoming", "Completed", "Cancelled"];

export default function DriverTripsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const trips =
    activeTab === "Upcoming"
      ? mockDriverTrips.upcoming
      : activeTab === "Completed"
      ? mockDriverTrips.completed
      : mockDriverTrips.cancelled;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Your trips</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("DriverEarnings")}
          style={styles.earningsButton}
        >
          <Text style={styles.earningsButtonText}>View earnings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const selected = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabChip, selected && styles.tabChipSelected]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[styles.tabChipText, selected && styles.tabChipTextSelected]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.route}>{item.route}</Text>
            <Text style={styles.meta}>
              {item.passengers} passenger
              {item.passengers > 1 ? "s" : ""} • {item.distanceKm} km
            </Text>
            <Text style={styles.meta}>{item.time}</Text>
            <View style={styles.footerRow}>
              <Text style={styles.fare}>Rs. {item.fare}</Text>
              <Text style={styles.status}>{item.status}</Text>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  earningsButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  earningsButtonText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  tabsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tabChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.divider,
    marginRight: 8,
  },
  tabChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabChipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabChipTextSelected: {
    color: colors.white,
    fontWeight: "600",
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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

