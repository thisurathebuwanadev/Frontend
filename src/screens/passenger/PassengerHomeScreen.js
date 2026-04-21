import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fetchCurrentUserProfile } from "../../services/userService";
import { fetchRideSummary } from "../../services/rideService";
import { fetchCarbonSavings } from "../../services/carbonService";

function StatBox({ icon, iconColor, label, value, bg }) {
  return (
    <View style={[styles.statBox, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function PassengerHomeScreen() {
  const [profile, setProfile] = useState(null);
  const [rides, setRides] = useState(null);
  const [carbon, setCarbon] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      Promise.all([fetchCurrentUserProfile(), fetchRideSummary(), fetchCarbonSavings()])
        .then(([p, r, c]) => {
          if (!active) return;
          setProfile(p);
          setRides(r);
          setCarbon(c);
        })
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

  const trustScore = parseFloat(profile?.trustScore ?? 0);
  const isVerified = !!profile?.isVerified;
  const displayName = profile ? `${profile.firstName}` : "there";

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.name}>{displayName} 👋</Text>

        {/* Section 1 — Trust & Verification */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Trust & Verification</Text>
          </View>

          <View style={styles.verifyRow}>
            <View style={[styles.verifyBadge, { backgroundColor: isVerified ? "#DCFCE7" : "#FEF3C7" }]}>
              <Ionicons
                name={isVerified ? "checkmark-circle" : "alert-circle"}
                size={16}
                color={isVerified ? "#16A34A" : "#D97706"}
              />
              <Text style={{ color: isVerified ? "#16A34A" : "#D97706", fontSize: 13, fontWeight: "600", marginLeft: 4 }}>
                {isVerified ? "Verified" : "Not Verified"}
              </Text>
            </View>
          </View>

          <Text style={styles.trustLabel}>Trust Score</Text>
          <View style={styles.trustRow}>
            <View style={styles.trustBarBg}>
              <View style={[styles.trustBarFill, { width: `${Math.min(trustScore, 100)}%` }]} />
            </View>
            <Text style={styles.trustPercent}>{trustScore.toFixed(0)}%</Text>
          </View>
        </View>

        {/* Section 2 — Ride Stats */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="car-sport-outline" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Ride Activity</Text>
          </View>

          <View style={styles.statsGrid}>
            <StatBox icon="checkmark-done" iconColor="#2563EB" label="Active Rides" value={rides?.acceptedRides ?? 0} bg="#EFF6FF" />
            <StatBox icon="swap-horizontal" iconColor="#7C3AED" label="Total Rides" value={rides?.totalRides ?? 0} bg="#F3E8FF" />
            <StatBox icon="wallet-outline" iconColor="#16A34A" label="Total Cost" value={`Rs ${(rides?.totalCost ?? 0).toFixed(2)}`} bg="#DCFCE7" />
          </View>
        </View>

        {/* Section 3 — Carbon Savings */}
        <View style={[styles.card, styles.carbonCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="leaf-outline" size={20} color="#16A34A" />
            <Text style={[styles.cardTitle, { color: "#166534" }]}>Carbon Savings</Text>
          </View>

          <View style={styles.carbonHero}>
            <Text style={styles.carbonBigNumber}>{(carbon?.totalCarbonSaved ?? 0).toFixed(2)}</Text>
            <Text style={styles.carbonUnit}>kg CO₂ saved</Text>
          </View>

          <View style={styles.carbonDivider} />

          <View style={styles.carbonRow}>
            <View style={styles.carbonStat}>
              <Ionicons name="navigate-outline" size={18} color="#166534" />
              <Text style={styles.carbonStatValue}>{(carbon?.totalDistance ?? 0).toFixed(1)} km</Text>
              <Text style={styles.carbonStatLabel}>Distance shared</Text>
            </View>
            <View style={styles.carbonStat}>
              <Ionicons name="calendar-outline" size={18} color="#166534" />
              <Text style={styles.carbonStatValue}>{carbon?.monthlyBreakdown?.length ?? 0}</Text>
              <Text style={styles.carbonStatLabel}>Active months</Text>
            </View>
          </View>

          {carbon?.monthlyBreakdown?.length > 0 && (
            <View style={styles.monthlySection}>
              <Text style={styles.monthlyTitle}>Monthly Breakdown</Text>
              {carbon.monthlyBreakdown.map((m) => (
                <View key={m.month} style={styles.monthlyRow}>
                  <Text style={styles.monthlyMonth}>{m.month}</Text>
                  <Text style={styles.monthlySaved}>{parseFloat(m.saved).toFixed(2)} kg</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingTop: 52, paddingBottom: 40 },
  greeting: { fontSize: 14, color: colors.textSecondary },
  name: { fontSize: 22, fontWeight: "700", color: colors.textPrimary, marginBottom: 24 },

  card: {
    backgroundColor: colors.white, borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },

  /* Trust */
  verifyRow: { marginBottom: 14 },
  verifyBadge: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  trustLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
  trustRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  trustBarBg: { flex: 1, height: 8, backgroundColor: "#E5E7EB", borderRadius: 4, overflow: "hidden" },
  trustBarFill: { height: 8, backgroundColor: colors.primary, borderRadius: 4 },
  trustPercent: { fontSize: 14, fontWeight: "700", color: colors.textPrimary, width: 40, textAlign: "right" },

  /* Stats */
  statsGrid: { flexDirection: "row", gap: 10 },
  statBox: {
    flex: 1, borderRadius: 14, padding: 14, alignItems: "center",
  },
  statValue: { fontSize: 18, fontWeight: "700", color: colors.textPrimary, marginTop: 8 },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2, textAlign: "center" },

  /* Carbon */
  carbonCard: { backgroundColor: "#F0FDF4" },
  carbonHero: { alignItems: "center", marginBottom: 14 },
  carbonBigNumber: { fontSize: 36, fontWeight: "800", color: "#166534" },
  carbonUnit: { fontSize: 14, color: "#16A34A", fontWeight: "500", marginTop: 2 },
  carbonDivider: { height: 1, backgroundColor: "#BBF7D0", marginBottom: 14 },
  carbonRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 14 },
  carbonStat: { alignItems: "center" },
  carbonStatValue: { fontSize: 16, fontWeight: "700", color: "#166534", marginTop: 4 },
  carbonStatLabel: { fontSize: 11, color: "#16A34A", marginTop: 2 },
  monthlySection: { backgroundColor: "#DCFCE7", borderRadius: 12, padding: 12 },
  monthlyTitle: { fontSize: 13, fontWeight: "600", color: "#166534", marginBottom: 8 },
  monthlyRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  monthlyMonth: { fontSize: 13, color: "#166534" },
  monthlySaved: { fontSize: 13, fontWeight: "600", color: "#166534" },
});
