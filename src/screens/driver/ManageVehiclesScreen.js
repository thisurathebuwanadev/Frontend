import React, { useCallback, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { addVehicle, fetchVehicles } from "../../services/driverService";

const VEHICLE_TYPES = ["car", "bike", "three-wheel", "van", "suv"];
const MAKES = ["SUZUKI", "TOYOTA", "HONDA", "KIA", "NISSAN", "BAJAJ", "TVS"];

const EMPTY_FORM = { vehicle_type: "", make: "", model: "", license_plate: "", capacity: "", fuel_efficiency: "" };

function ChipSelector({ options, selected, onSelect }) {
  return (
    <View style={styles.chipRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, selected === opt && styles.chipSelected]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.chipText, selected === opt && styles.chipTextSelected]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ManageVehiclesScreen() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      fetchVehicles()
        .then((data) => active && setVehicles(data))
        .catch(() => {})
        .finally(() => active && setLoading(false));
      return () => { active = false; };
    }, [])
  );

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleAdd = async () => {
    if (!form.vehicle_type || !form.make || !form.model || !form.license_plate) return;
    const payload = {
      ...form,
      capacity: parseInt(form.capacity, 10) || 0,
      fuel_efficiency: parseFloat(form.fuel_efficiency) || 0,
    };
    setSaving(true);
    try {
      const { vehicleId } = await addVehicle(payload);
      setVehicles((prev) => [...prev, { ...payload, vehicle_id: vehicleId }]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Failed to add vehicle");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Manage Vehicles</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(!showForm)}>
          <Ionicons name={showForm ? "close" : "add"} size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      {showForm && (
        <ScrollView style={styles.formCard} contentContainerStyle={styles.formContent} nestedScrollEnabled>
          <Text style={styles.label}>Vehicle type</Text>
          <ChipSelector options={VEHICLE_TYPES} selected={form.vehicle_type} onSelect={(v) => updateField("vehicle_type", v)} />

          <Text style={styles.label}>Make</Text>
          <ChipSelector options={MAKES} selected={form.make} onSelect={(v) => updateField("make", v)} />

          <Text style={styles.label}>Model</Text>
          <TextInput style={styles.input} placeholder="e.g. Alto 800" placeholderTextColor={colors.placeholderText} value={form.model} onChangeText={(v) => updateField("model", v)} />

          <Text style={styles.label}>License plate</Text>
          <TextInput style={styles.input} placeholder="e.g. ABC-1234" placeholderTextColor={colors.placeholderText} value={form.license_plate} onChangeText={(v) => updateField("license_plate", v)} autoCapitalize="characters" />

          <Text style={styles.label}>Capacity (cc)</Text>
          <TextInput style={styles.input} placeholder="e.g. 1000" placeholderTextColor={colors.placeholderText} value={form.capacity} onChangeText={(v) => updateField("capacity", v)} keyboardType="number-pad" />

          <Text style={styles.label}>Fuel efficiency (km/l)</Text>
          <TextInput style={styles.input} placeholder="e.g. 18.5" placeholderTextColor={colors.placeholderText} value={form.fuel_efficiency} onChangeText={(v) => updateField("fuel_efficiency", v)} keyboardType="decimal-pad" />

          <TouchableOpacity style={[styles.saveButton, saving && { opacity: 0.6 }]} onPress={handleAdd} disabled={saving}>
            {saving ? <ActivityIndicator color={colors.successTextOnDark} /> : <Text style={styles.saveButtonText}>Add Vehicle</Text>}
          </TouchableOpacity>
        </ScrollView>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => String(item.vehicle_id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No vehicles added yet</Text>}
          renderItem={({ item }) => (
            <View style={styles.vehicleCard}>
              <Text style={styles.vehicleName}>{item.make} {item.model}</Text>
              <Text style={styles.vehicleMeta}>{item.vehicle_type.toUpperCase()} • {item.license_plate}</Text>
              <Text style={styles.vehicleMeta}>{item.capacity}cc • {item.fuel_efficiency} km/l</Text>
            </View>
          )}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 48, paddingHorizontal: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "700", color: colors.textPrimary },
  addButton: { backgroundColor: colors.primary, width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  formCard: {
    backgroundColor: colors.white, borderRadius: 20, maxHeight: 420, marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 10 }, elevation: 6,
  },
  formContent: { padding: 20 },
  label: { fontSize: 13, fontWeight: "500", color: colors.textSecondary, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.divider, color: colors.textPrimary,
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, fontSize: 15,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: colors.divider },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textSecondary },
  chipTextSelected: { color: colors.white, fontWeight: "600" },
  saveButton: {
    backgroundColor: colors.success, paddingVertical: 12, borderRadius: 999, alignItems: "center", marginTop: 20,
  },
  saveButtonText: { color: colors.successTextOnDark, fontSize: 15, fontWeight: "700" },
  listContent: { paddingBottom: 24 },
  emptyText: { textAlign: "center", color: colors.textSecondary, marginTop: 40, fontSize: 14 },
  vehicleCard: {
    backgroundColor: colors.white, borderRadius: 16, padding: 14, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  vehicleName: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
  vehicleMeta: { marginTop: 4, fontSize: 13, color: colors.textSecondary },
});
