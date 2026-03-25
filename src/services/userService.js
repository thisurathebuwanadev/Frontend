import api from "./api";
import { mockDrivers } from "../data/mockDrivers";

// User / profile related APIs.

export async function fetchCurrentUserProfile() {
  // REAL API CALL (UNCOMMENT WHEN BACKEND IS READY)
  // return api.get("/me").then((res) => res.data);

  // TEMPORARY PROFILE
  // For now, the profile is provided by the auth context, so this is a stub.
  return null;
}

export async function fetchNearbyDrivers() {
  // REAL API CALL (UNCOMMENT WHEN BACKEND IS READY)
  // return api.get("/passenger/drivers").then((res) => res.data);

  // TEMPORARY FRONTEND DATA
  return mockDrivers;
}

