import React, { useCallback, useState } from "react";
import {
  ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { colors } from "../../theme/colors";
import { fetchVerificationStatus, uploadDocument } from "../../services/verificationService";

const STEPS = [
  { key: "national_id", label: "National ID (NIC)", icon: "id-card-outline" },
  { key: "address_proof", label: "Address Proof", icon: "home-outline" },
  { key: "driver_license", label: "Driver's License", icon: "car-outline" },
  { key: "vehicle_photo", label: "Vehicle Photo", icon: "camera-outline" },
];

const STATUS_CONFIG = {
  approved: { label: "Approved", color: "#16A34A", bg: "#DCFCE7", icon: "checkmark-circle" },
  pending: { label: "Pending Review", color: "#D97706", bg: "#FEF3C7", icon: "time" },
  rejected: { label: "Rejected", color: "#DC2626", bg: "#FEE2E2", icon: "close-circle" },
};

export default function ManageDocumentsScreen() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      fetchVerificationStatus()
        .then((data) => {
          if (!active) return;
          setDocs(data);
          const firstIncomplete = STEPS.findIndex(
            (s) => !data.some((d) => d.document_type === s.key)
          );
          setCurrentStep(firstIncomplete === -1 ? STEPS.length : firstIncomplete);
        })
        .catch(() => {})
        .finally(() => active && setLoading(false));
      return () => { active = false; };
    }, [])
  );

  const getDocForStep = (key) => docs.find((d) => d.document_type === key);

  const pickAndUpload = async (docType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "application/pdf"],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      const file = result.assets[0];
      setUploading(docType);
      await uploadDocument(file.uri, file.name, file.mimeType, docType);

      const updated = await fetchVerificationStatus();
      setDocs(updated);
      const firstIncomplete = STEPS.findIndex(
        (s) => !updated.some((d) => d.document_type === s.key)
      );
      setCurrentStep(firstIncomplete === -1 ? STEPS.length : firstIncomplete);
    } catch (e) {
      Alert.alert("Upload failed", e.response?.data?.message || e.message);
    } finally {
      setUploading(null);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const allDone = STEPS.every((s) => getDocForStep(s.key));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Manage Documents</Text>
        <Text style={styles.subtitle}>
          Upload your documents to get verified. Complete all steps to increase your trust score.
        </Text>

        {/* Progress */}
        <View style={styles.progressRow}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[styles.progressDot, getDocForStep(STEPS[i].key) ? styles.progressDotDone : (i === currentStep ? styles.progressDotActive : null)]}
            />
          ))}
        </View>

        {allDone && (
          <View style={styles.allDoneBanner}>
            <Ionicons name="checkmark-done-circle" size={22} color="#16A34A" />
            <Text style={styles.allDoneText}>All documents uploaded!</Text>
          </View>
        )}

        {STEPS.map((step, index) => {
          const doc = getDocForStep(step.key);
          const isActive = index === currentStep && !doc;
          const status = doc ? STATUS_CONFIG[doc.verification_status] || STATUS_CONFIG.pending : null;

          return (
            <View key={step.key} style={[styles.stepCard, isActive && styles.stepCardActive]}>
              <View style={styles.stepHeader}>
                <View style={[styles.stepNumber, doc ? styles.stepNumberDone : (isActive ? styles.stepNumberActive : null)]}>
                  {doc ? (
                    <Ionicons name="checkmark" size={14} color={colors.white} />
                  ) : (
                    <Text style={[styles.stepNumberText, isActive && { color: colors.white }]}>{index + 1}</Text>
                  )}
                </View>
                <Ionicons name={step.icon} size={20} color={doc ? "#16A34A" : (isActive ? colors.primary : colors.textSecondary)} style={{ marginRight: 8 }} />
                <Text style={[styles.stepLabel, doc && { color: colors.textSecondary }]}>{step.label}</Text>
              </View>

              {doc && status && (
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                  <Ionicons name={status.icon} size={14} color={status.color} />
                  <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                  {doc.trust_points && (
                    <Text style={[styles.statusPoints, { color: status.color }]}>+{parseFloat(doc.trust_points).toFixed(0)} pts</Text>
                  )}
                </View>
              )}

              {!doc && isActive && (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => pickAndUpload(step.key)}
                  disabled={!!uploading}
                >
                  {uploading === step.key ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <>
                      <Ionicons name="cloud-upload-outline" size={18} color={colors.white} />
                      <Text style={styles.uploadButtonText}>Upload</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              {!doc && !isActive && (
                <Text style={styles.lockedText}>Complete previous steps first</Text>
              )}

              {doc && doc.verification_status === "rejected" && (
                <TouchableOpacity
                  style={[styles.uploadButton, { backgroundColor: "#DC2626" }]}
                  onPress={() => pickAndUpload(step.key)}
                  disabled={!!uploading}
                >
                  {uploading === step.key ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <>
                      <Ionicons name="refresh-outline" size={18} color={colors.white} />
                      <Text style={styles.uploadButtonText}>Re-upload</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: "700", color: colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 20 },
  progressRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  progressDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: "#E5E7EB" },
  progressDotDone: { backgroundColor: "#16A34A" },
  progressDotActive: { backgroundColor: colors.primary },
  allDoneBanner: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#DCFCE7",
    padding: 12, borderRadius: 12, marginBottom: 16, gap: 8,
  },
  allDoneText: { fontSize: 14, fontWeight: "600", color: "#16A34A" },
  stepCard: {
    backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  stepCardActive: { borderWidth: 1.5, borderColor: colors.primary },
  stepHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  stepNumber: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: "#E5E7EB",
    alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  stepNumberDone: { backgroundColor: "#16A34A" },
  stepNumberActive: { backgroundColor: colors.primary },
  stepNumberText: { fontSize: 12, fontWeight: "700", color: colors.textSecondary },
  stepLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: colors.textPrimary },
  statusBadge: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, gap: 4, marginTop: 4,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  statusPoints: { fontSize: 11, fontWeight: "500", marginLeft: 4 },
  uploadButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: colors.primary, paddingVertical: 10, borderRadius: 999, marginTop: 10, gap: 6,
  },
  uploadButtonText: { color: colors.white, fontSize: 14, fontWeight: "600" },
  lockedText: { fontSize: 12, color: colors.textSecondary, fontStyle: "italic", marginTop: 2 },
});
