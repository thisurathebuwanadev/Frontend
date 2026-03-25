import api from "./api";
import { mockDriverTrips } from "../data/mockDriverTrips";
import { mockTrips } from "../data/mockTrips";

// Trip history and active trip helpers.

export async function fetchDriverTrips() {
  // REAL API CALL (UNCOMMENT WHEN BACKEND IS READY)
  // return api.get("/driver/trips").then((res) => res.data);

  // TEMPORARY FRONTEND DATA
  return mockDriverTrips;
}

export async function fetchPassengerTrips() {
  // REAL API CALL (UNCOMMENT WHEN BACKEND IS READY)
  // return api.get("/passenger/trips").then((res) => res.data);

  // TEMPORARY FRONTEND DATA
  return mockTrips;
}

