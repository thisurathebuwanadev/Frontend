import api from "./api";
import { mockDrivers } from "../data/mockDrivers";

// User / profile related APIs.

export async function fetchCurrentUserProfile() {
  const res = await api.get("/users/profile");
  return res.data.data;
}

export async function fetchNearbyDrivers() {
  // REAL API CALL (UNCOMMENT WHEN BACKEND IS READY)
  // return api.get("/passenger/drivers").then((res) => res.data);

  // TEMPORARY FRONTEND DATA
  return mockDrivers;
}

