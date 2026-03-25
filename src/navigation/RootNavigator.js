import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import PassengerTabs from "./PassengerTabs";
import DriverTabs from "./DriverTabs";
import { useAuth } from "../hooks/useAuth";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, currentUser } = useAuth();

  const role = currentUser?.role;

  console.log("USER", currentUser);
  console.log("ROLE", role);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : role === "driver" ? (
        <Stack.Screen name="DriverTabs" component={DriverTabs} />
      ) : (
        <Stack.Screen name="PassengerTabs" component={PassengerTabs} />
      )}
    </Stack.Navigator>
  );
}

