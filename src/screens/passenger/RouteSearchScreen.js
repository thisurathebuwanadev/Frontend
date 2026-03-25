import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { mockDrivers } from "../../data/mockDrivers";

export default function RouteSearchScreen({ navigation }) {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [timeWindow, setTimeWindow] = useState("");
  const [passengers, setPassengers] = useState("1");

  const handleSearch = () => {
    const results = mockDrivers;
    navigation.navigate("DriverList", {
      results,
      criteria: {
        start,
        destination,
        timeWindow,
        passengers,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find a Route</Text>
        <Text style={styles.headerSubtitle}>
          Set your trip details to see nearby drivers.
        </Text>
      </View>

      <View style={styles.searchCard}>
        <View style={styles.inputRow}>
          <Ionicons
            name="location-outline"
            size={18}
            color={colors.primary}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Start location"
            placeholderTextColor={colors.placeholderText}
            style={styles.input}
            value={start}
            onChangeText={setStart}
          />
        </View>

        <View style={styles.inputRow}>
          <Ionicons
            name="flag-outline"
            size={18}
            color={colors.accent}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Destination"
            placeholderTextColor={colors.placeholderText}
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        <View style={styles.inputRow}>
          <Ionicons
            name="time-outline"
            size={18}
            color={colors.secondary}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Time window (e.g. 8:00–8:30 AM)"
            placeholderTextColor={colors.placeholderText}
            style={styles.input}
            value={timeWindow}
            onChangeText={setTimeWindow}
          />
        </View>

        <View style={styles.inputRow}>
          <Ionicons
            name="people-outline"
            size={18}
            color={colors.secondary}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Passengers"
            placeholderTextColor={colors.placeholderText}
            style={styles.input}
            keyboardType="number-pad"
            value={passengers}
            onChangeText={setPassengers}
          />
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search routes</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  searchCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.textPrimary,
  },
  searchButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
});

