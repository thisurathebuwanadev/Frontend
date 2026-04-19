import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "../../theme/colors";
import { publishRoute } from "../../services/routeService";

const DEFAULT_REGION = {
  latitude: 6.9271,
  longitude: 79.8612,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

export default function CreateRouteScreen({ navigation }) {
  const [startLocation, setStartLocation] = useState("");
  const [startCoords, setStartCoords] = useState(null);
  const [destination, setDestination] = useState("");
  const [destCoords, setDestCoords] = useState(null);
  const [departureTime, setDepartureTime] = useState("");
  const [timeDate, setTimeDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [seats, setSeats] = useState("3");
  const [vehicle, setVehicle] = useState("Toyota Prius • Blue");
  const [loading, setLoading] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [pickingField, setPickingField] = useState(null);
  const [tempMarker, setTempMarker] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setStartCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  const openPicker = (field) => {
    setPickingField(field);
    setTempMarker(null);
    setMapVisible(true);
  };

  const confirmLocation = async () => {
    if (!tempMarker) return;
    let label;
    try {
      const [place] = await Location.reverseGeocodeAsync(tempMarker);
      const parts = [place?.name, place?.street, place?.city].filter(Boolean);
      label = parts.join(", ") || `${tempMarker.latitude.toFixed(4)}, ${tempMarker.longitude.toFixed(4)}`;
    } catch {
      label = `${tempMarker.latitude.toFixed(4)}, ${tempMarker.longitude.toFixed(4)}`;
    }
    if (pickingField === "start") {
      setStartCoords(tempMarker);
      setStartLocation(label);
    } else {
      setDestCoords(tempMarker);
      setDestination(label);
    }
    setMapVisible(false);
    setTempMarker(null);
  };

  const mapRegion = startCoords
    ? { ...startCoords, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : DEFAULT_REGION;

  const handlePublish = async () => {
    if (loading) return;

    if (!startLocation.trim() || !destination.trim() || !departureTime.trim()) {
      Alert.alert("Missing details", "Please fill in all route details.");
      return;
    }

    setLoading(true);
    try {
      await publishRoute({
        startLatitude: startCoords?.latitude ?? 0,
        startLongitude: startCoords?.longitude ?? 0,
        endLatitude: destCoords?.latitude ?? 0,
        endLongitude: destCoords?.longitude ?? 0,
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
          <TouchableOpacity style={styles.inputRow} onPress={() => openPicker("start")}>
            <Ionicons name="location-outline" size={18} color={colors.primary} style={styles.inputIcon} />
            <Text style={[styles.inputText, !startLocation && { color: colors.placeholderText }]}>
              {startLocation || "Pick start location on map"}
            </Text>
            <Ionicons name="map-outline" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.label}>Destination</Text>
          <TouchableOpacity style={styles.inputRow} onPress={() => openPicker("destination")}>
            <Ionicons name="flag-outline" size={18} color={colors.accent} style={styles.inputIcon} />
            <Text style={[styles.inputText, !destination && { color: colors.placeholderText }]}>
              {destination || "Pick destination on map"}
            </Text>
            <Ionicons name="map-outline" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.label}>Departure time</Text>
          <TouchableOpacity style={styles.inputRow} onPress={() => setShowTimePicker(true)}>
            <Ionicons name="time-outline" size={18} color={colors.secondary} style={styles.inputIcon} />
            <Text style={[styles.inputText, !departureTime && { color: colors.placeholderText }]}>
              {departureTime || "Pick departure time"}
            </Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={timeDate}
              mode="time"
              is24Hour
              onChange={(_, selected) => {
                setShowTimePicker(false);
                if (selected) {
                  setTimeDate(selected);
                  const h = String(selected.getHours()).padStart(2, "0");
                  const m = String(selected.getMinutes()).padStart(2, "0");
                  setDepartureTime(`${h}:${m}:00`);
                }
              }}
            />
          )}

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

      {/* Full-screen map picker modal */}
      <Modal visible={mapVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={mapRegion}
            onPress={(e) => setTempMarker(e.nativeEvent.coordinate)}
          >
            {tempMarker && <Marker coordinate={tempMarker} />}
          </MapView>

          <View style={styles.modalTopBar}>
            <Text style={styles.modalTitle}>
              Tap to select {pickingField === "start" ? "start location" : "destination"}
            </Text>
          </View>

          <View style={styles.modalBottomBar}>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => { setMapVisible(false); setTempMarker(null); }}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalConfirmBtn, !tempMarker && { opacity: 0.4 }]}
              onPress={confirmLocation}
              disabled={!tempMarker}
            >
              <Text style={styles.modalConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 8 },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
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
  /* Modal */
  modalContainer: { flex: 1 },
  modalTopBar: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 4,
  },
  modalTitle: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
  modalBottomBar: {
    position: "absolute",
    bottom: 36,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalCancelBtn: {
    flex: 1,
    marginRight: 8,
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    elevation: 3,
  },
  modalCancelText: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
  modalConfirmBtn: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    elevation: 3,
  },
  modalConfirmText: { fontSize: 15, fontWeight: "600", color: colors.white },
});
