import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import DriverHomeScreen from "../screens/driver/DriverHomeScreen";
import CreateRouteScreen from "../screens/driver/CreateRouteScreen";
import DriverRequestsScreen from "../screens/driver/DriverRequestsScreen";
import DriverTripsScreen from "../screens/driver/DriverTripsScreen";
import ActiveTripScreen from "../screens/driver/ActiveTripScreen";
import DriverRouteListScreen from "../screens/driver/DriverRouteListScreen";
import DriverEarningsScreen from "../screens/driver/DriverEarningsScreen";
import ProfileScreen from "../screens/shared/ProfileScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();
const RoutesStack = createNativeStackNavigator();
const RequestsStack = createNativeStackNavigator();
const TripsStack = createNativeStackNavigator();

function PlaceholderScreen({ label }) {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>{label}</Text>
    </View>
  );
}

function RoutesStackNavigator() {
  return (
    <RoutesStack.Navigator screenOptions={{ headerShown: false }}>
      <RoutesStack.Screen
        name="DriverRouteList"
        component={DriverRouteListScreen}
      />
      <RoutesStack.Screen name="CreateRoute" component={CreateRouteScreen} />
    </RoutesStack.Navigator>
  );
}

function RequestsStackNavigator() {
  return (
    <RequestsStack.Navigator screenOptions={{ headerShown: false }}>
      <RequestsStack.Screen
        name="DriverRequests"
        component={DriverRequestsScreen}
      />
      <RequestsStack.Screen name="ActiveTrip" component={ActiveTripScreen} />
    </RequestsStack.Navigator>
  );
}

function TripsStackNavigator() {
  return (
    <TripsStack.Navigator screenOptions={{ headerShown: false }}>
      <TripsStack.Screen name="DriverTrips" component={DriverTripsScreen} />
      <TripsStack.Screen
        name="DriverEarnings"
        component={DriverEarningsScreen}
      />
    </TripsStack.Navigator>
  );
}

export default function DriverTabs() {
  const pendingRequestsCount = 3; // mock badge count for now

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
            iconName = "speedometer-outline";
          } else if (route.name === "Routes") {
            iconName = "navigate-outline";
          } else if (route.name === "Requests") {
            iconName = "list-outline";
          } else if (route.name === "Trips") {
            iconName = "car-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DriverHomeScreen} />
      <Tab.Screen
        name="Routes"
        component={RoutesStackNavigator}
        options={{ title: "Routes" }}
      />
      <Tab.Screen
        name="Requests"
        component={RequestsStackNavigator}
        options={{
          tabBarBadge:
            typeof pendingRequestsCount === "number" && pendingRequestsCount > 0
              ? pendingRequestsCount
              : undefined,
        }}
      />
      <Tab.Screen
        name="Trips"
        component={TripsStackNavigator}
        options={{ title: "Trips" }}
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

