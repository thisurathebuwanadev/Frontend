import React, { useEffect, useState } from "react";
import {
  Modal,
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
import { searchRoutes } from "../../services/routeService";

const DEFAULT_REGION = {
  latitude: 6.9271,
  longitude: 79.8612,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

export default function RouteSearchScreen({ navigation }) {
  const [start, setStart] = useState("");
  const [startCoords, setStartCoords] = useState(null);
  const [destination, setDestination] = useState("");
  const [destCoords, setDestCoords] = useState(null);
  const [timeWindow, setTimeWindow] = useState("");
  const [timeDate, setTimeDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [passengers, setPassengers] = useState("1");
  const [selectedDays, setSelectedDays] = useState([]);
  const [mapVisible, setMapVisible] = useState(false);
  const [pickingField, setPickingField] = useState(null); // "start" | "destination"
  const [tempMarker, setTempMarker] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setStartCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  const handleMapPress = (e) => {
    setTempMarker(e.nativeEvent.coordinate);
  };

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
      setStart(label);
    } else {
      setDestCoords(tempMarker);
      setDestination(label);
    }
    setMapVisible(false);
    setTempMarker(null);
  };

  const handleSearch = async () => {
    try {
      const res = await searchRoutes({
        startLatitude: startCoords?.latitude ?? 0,
        startLongitude: startCoords?.longitude ?? 0,
        endLatitude: destCoords?.latitude ?? 0,
        endLongitude: destCoords?.longitude ?? 0,
        departureTime: timeWindow,
        passengerCount: parseInt(passengers, 10) || 1,
        days: selectedDays,
      });
      const results = (res.data || []).map((r) => ({
        id: String(r.routeId),
        driverId: r.driverId,
        name: r.driverName,
        vehicle: r.vehicleType,
        startAddress: r.startAddress,
        endAddress: r.endAddress,
        departureTime: r.departureTime,
        availableSeats: r.availableSeats,
        costPerPassenger: r.costPerPassenger,
        trustScore: parseFloat(r.trustScore),
        compatibilityScore: r.compatibilityScore,
        compositeScore: r.compositeScore,
        pickupDistance: r.distanceFromPickup,
      }));
      navigation.navigate("DriverList", {
        results,
        criteria: { start, destination, timeWindow, passengers, pickupLatitude: startCoords?.latitude, pickupLongitude: startCoords?.longitude },
      });
    } catch (e) {
      console.error("Route search failed", e);
    }
  };

  const mapRegion = startCoords
    ? { ...startCoords, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : DEFAULT_REGION;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find a Route</Text>
        <Text style={styles.headerSubtitle}>
          Set your trip details to see nearby drivers.
        </Text>
      </View>

      {/* Mini map preview */}
      <View style={styles.mapPreview}>
        <MapView style={StyleSheet.absoluteFill} region={mapRegion} pointerEvents="none">
          {startCoords && <Marker coordinate={startCoords} pinColor="blue" />}
          {destCoords && <Marker coordinate={destCoords} pinColor="red" />}
        </MapView>
      </View>

      <View style={styles.searchCard}>
        {/* Start location – opens map picker */}
        <TouchableOpacity style={styles.inputRow} onPress={() => openPicker("start")}>
          <Ionicons name="location-outline" size={18} color={colors.primary} style={styles.inputIcon} />
          <Text style={[styles.input, !start && { color: colors.placeholderText }]}>
            {start || "Pick start location on map"}
          </Text>
          <Ionicons name="map-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Destination – opens map picker */}
        <TouchableOpacity style={styles.inputRow} onPress={() => openPicker("destination")}>
          <Ionicons name="flag-outline" size={18} color={colors.accent} style={styles.inputIcon} />
          <Text style={[styles.input, !destination && { color: colors.placeholderText }]}>
            {destination || "Pick destination on map"}
          </Text>
          <Ionicons name="map-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.inputRow} onPress={() => setShowTimePicker(true)}>
          <Ionicons name="time-outline" size={18} color={colors.secondary} style={styles.inputIcon} />
          <Text style={[styles.input, !timeWindow && { color: colors.placeholderText }]}>
            {timeWindow || "Pick departure time"}
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
                setTimeWindow(`${h}:${m}:00`);
              }
            }}
          />
        )}

        <View style={styles.daysRow}>
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => {
            const active = selectedDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayChip, active && styles.dayChipActive]}
                onPress={() =>
                  setSelectedDays((prev) =>
                    active ? prev.filter((d) => d !== day) : [...prev, day]
                  )
                }
              >
                <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="people-outline" size={18} color={colors.secondary} style={styles.inputIcon} />
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

      {/* Full-screen map picker modal */}
      <Modal visible={mapVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={mapRegion}
            onPress={handleMapPress}
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
  header: { marginBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: colors.textPrimary },
  headerSubtitle: { marginTop: 4, fontSize: 14, color: colors.textSecondary },
  mapPreview: {
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
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
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.textPrimary,
  },
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  dayChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.white,
  },
  dayChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  dayChipTextActive: {
    color: colors.white,
  },
  searchButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  searchButtonText: { color: colors.white, fontSize: 15, fontWeight: "600" },
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
