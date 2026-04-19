import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { useAuth } from "../../hooks/useAuth";
import { fetchCurrentUserProfile } from "../../services/userService";
import Avatar from "../../components/Avatar";

function MenuButton({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <Ionicons name={icon} size={20} color={colors.textPrimary} />
      <Text style={styles.menuButtonText}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      fetchCurrentUserProfile()
        .then((data) => active && setProfile(data))
        .catch(() => {})
        .finally(() => active && setLoading(false));
      return () => { active = false; };
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : currentUser?.name || "RouteMate user";
  const role = (profile?.userType === "both" ? "Driver & Passenger" : profile?.userType) || (currentUser?.role === "DRIVER" ? "Driver" : "Passenger");
  const trustScore = parseFloat(profile?.trustScore ?? 0);
  const isVerified = !!profile?.isVerified;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Avatar name={displayName} size={72} uri={profile?.profileImageUrl} />
          <Text style={styles.fullName}>{displayName}</Text>
          <Text style={styles.roleText}>{role}</Text>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: isVerified ? "#DCFCE7" : "#FEF3C7" }]}>
              <Ionicons
                name={isVerified ? "checkmark-circle" : "alert-circle"}
                size={16}
                color={isVerified ? "#16A34A" : "#D97706"}
              />
              <Text style={[styles.badgeText, { color: isVerified ? "#16A34A" : "#D97706" }]}>
                {isVerified ? "Verified" : "Not Verified"}
              </Text>
            </View>
          </View>

          <View style={styles.trustContainer}>
            <Text style={styles.trustLabel}>Trust Score</Text>
            <View style={styles.trustBarBg}>
              <View style={[styles.trustBarFill, { width: `${trustScore}%` }]} />
            </View>
            <Text style={styles.trustValue}>{trustScore.toFixed(0)}%</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Profile details</Text>
          <DetailRow label="Full name" value={displayName} />
          <DetailRow label="Email" value={profile?.email ?? currentUser?.email ?? "Not signed in"} />
          <DetailRow label="Phone" value={profile?.phoneNumber ?? "Not set"} last />
        </View>

        <View style={styles.card}>
          <MenuButton
            icon="create-outline"
            label="Edit Profile"
            onPress={() => navigation.navigate("EditProfile", { profile })}
          />
          {(currentUser?.role === "DRIVER" || profile?.userType === "both") && (
            <>
              <MenuButton icon="car-outline" label="Manage Vehicles" onPress={() => navigation.navigate("ManageVehicles")} />
              <MenuButton icon="document-text-outline" label="Manage Documents" onPress={() => navigation.navigate("ManageDocuments")} />
            </>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, last }) {
  return (
    <View style={[styles.detailRow, !last && styles.detailRowBorder]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 24, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 24 },
  fullName: { fontSize: 20, fontWeight: "700", color: colors.textPrimary, marginTop: 12 },
  roleText: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  badgeRow: { flexDirection: "row", marginTop: 10 },
  badge: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: "600", marginLeft: 4 },
  trustContainer: { alignItems: "center", marginTop: 14, width: "60%" },
  trustLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  trustBarBg: { width: "100%", height: 6, backgroundColor: "#E5E7EB", borderRadius: 3, overflow: "hidden" },
  trustBarFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  trustValue: { fontSize: 12, fontWeight: "600", color: colors.textPrimary, marginTop: 4 },
  card: {
    backgroundColor: colors.white, borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 10 }, elevation: 6,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginBottom: 12 },
  detailRow: { paddingVertical: 10 },
  detailRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.background },
  detailLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 2 },
  detailValue: { fontSize: 15, color: colors.textPrimary, fontWeight: "500" },
  menuButton: {
    flexDirection: "row", alignItems: "center", paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.background,
  },
  menuButtonText: { flex: 1, marginLeft: 12, fontSize: 15, color: colors.textPrimary, fontWeight: "500" },
  logoutButton: {
    backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 999,
    alignItems: "center", marginTop: 8,
  },
  logoutButtonText: { color: colors.white, fontSize: 16, fontWeight: "700" },
});
