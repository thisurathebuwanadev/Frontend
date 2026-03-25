import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import PassengerHomeScreen from "../screens/passenger/PassengerHomeScreen";
import RouteSearchScreen from "../screens/passenger/RouteSearchScreen";
import DriverListScreen from "../screens/passenger/DriverListScreen";
import RideRequestScreen from "../screens/passenger/RideRequestScreen";
import RideTrackingScreen from "../screens/passenger/RideTrackingScreen";
import PassengerTripsScreen from "../screens/passenger/PassengerTripsScreen";
import PassengerNotificationsScreen from "../screens/passenger/PassengerNotificationsScreen";
import ProfileScreen from "../screens/shared/ProfileScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();
const SearchStack = createNativeStackNavigator();

function PlaceholderScreen({ label }) {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>{label}</Text>
    </View>
  );
}

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="DriverSearch" component={RouteSearchScreen} />
      <SearchStack.Screen name="DriverList" component={DriverListScreen} />
      <SearchStack.Screen name="RideRequest" component={RideRequestScreen} />
      <SearchStack.Screen name="RideTracking" component={RideTrackingScreen} />
    </SearchStack.Navigator>
  );
}

export default function PassengerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.divider,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = "home-outline";

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Search") {
            iconName = "search-outline";
          } else if (route.name === "Trips") {
            iconName = "car-outline";
          } else if (route.name === "Notifications") {
            iconName = "notifications-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={PassengerHomeScreen} />
      <Tab.Screen name="Search" component={SearchStackNavigator} />
      <Tab.Screen name="Trips" component={PassengerTripsScreen} />
      <Tab.Screen
        name="Notifications"
        component={PassengerNotificationsScreen}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    backgroundColor: colors.darkBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: colors.textOnDark,
    fontSize: 16,
  },
});

