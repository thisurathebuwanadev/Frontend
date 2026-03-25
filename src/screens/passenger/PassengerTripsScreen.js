import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { colors } from "../../theme/colors";
import { mockTrips } from "../../data/mockTrips";

const TABS = ["Upcoming", "Completed", "Cancelled"];

export default function PassengerTripsScreen() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const trips =
    activeTab === "Upcoming"
      ? mockTrips.upcoming
      : activeTab === "Completed"
      ? mockTrips.completed
      : mockTrips.cancelled;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your trips</Text>

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
                style={[
                  styles.tabChipText,
                  selected && styles.tabChipTextSelected,
                ]}
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
            <Text style={styles.driver}>{item.driver}</Text>
            <Text style={styles.route}>{item.route}</Text>
            <Text style={styles.meta}>{item.date}</Text>
            <View style={styles.footerRow}>
              <Text style={styles.cost}>{item.cost}</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
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
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  driver: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  route: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
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
  cost: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  status: {
    fontSize: 13,
    color: colors.secondary,
  },
});

