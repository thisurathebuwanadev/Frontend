import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../theme/colors";
import { publishRoute } from "../../services/routeService";

export default function CreateRouteScreen({ navigation }) {
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [seats, setSeats] = useState("3");
  const [vehicle, setVehicle] = useState("Toyota Prius • Blue");
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (loading) return;

    if (!startLocation.trim() || !destination.trim() || !departureTime.trim()) {
      Alert.alert("Missing details", "Please fill in all route details.");
      return;
    }

    setLoading(true);
    try {
      await publishRoute({
        startLatitude: 0,
        startLongitude: 0,
        endLatitude: 0,
        endLongitude: 0,
        startAddress: startLocation.trim(),
        endAddress: destination.trim(),
        departureTime: departureTime.trim(),
        availableSeats: parseInt(seats, 10) || 1,
      });
      Alert.alert("Route published", "Your commuting route is now live.", [
        {
          text: "OK",
          onPress: () =>
            navigation.navigate("DriverRouteList", { justPublished: true }),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Publish a commuting route</Text>
          <Text style={styles.subtitle}>
            Match with passengers who travel along your daily route.
          </Text>

          <Text style={styles.label}>Start location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Negombo Bus Stand"
            placeholderTextColor={colors.placeholderText}
            value={startLocation}
            onChangeText={setStartLocation}
          />
          <Text style={styles.helperText}>
            For now, start typing the name or address. Google Places
            autocomplete can be wired here later.
          </Text>

          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Colombo Fort"
            placeholderTextColor={colors.placeholderText}
            value={destination}
            onChangeText={setDestination}
          />

          <Text style={styles.label}>Departure time</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 8:30 AM"
            placeholderTextColor={colors.placeholderText}
            value={departureTime}
            onChangeText={setDepartureTime}
          />

          <Text style={styles.label}>Available seats</Text>
          <TextInput
            style={styles.input}
            placeholder="3"
            placeholderTextColor={colors.placeholderText}
            keyboardType="number-pad"
            value={seats}
            onChangeText={setSeats}
          />

          <Text style={styles.label}>Vehicle</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Toyota Prius • Blue"
            placeholderTextColor={colors.placeholderText}
            value={vehicle}
            onChangeText={setVehicle}
          />
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handlePublish}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Publishing..." : "Publish route"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 20,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    color: colors.textPrimary,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    fontSize: 15,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
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
  },
  primaryButtonText: {
    color: colors.successTextOnDark,
    fontSize: 16,
    fontWeight: "700",
  },
});

