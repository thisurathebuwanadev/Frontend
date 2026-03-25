import api from "./api";
import { mockRoutes } from "../data/mockRoutes";

// Route-related API calls for drivers and passengers.

export async function fetchDriverRoutes() {
  // REAL API CALL (UNCOMMENT WHEN BACKEND IS READY)
  // return api.get("/driver/routes").then((res) => res.data);

  // TEMPORARY FRONTEND DATA
  // This function currently returns mock routes for development.
  // Remove this block and uncomment the API call above when backend is connected.
  return mockRoutes;
}

export async function publishRoute(payload) {
  // REAL API CALL (UNCOMMENT WHEN BACKEND IS READY)
  // return api.post("/driver/routes", payload).then((res) => res.data);

  // TEMPORARY FRONTEND PUBLISH
  // Echo the payload back with a generated id and Live status.
  return {
    id: `route-${Date.now()}`,
    status: "Live",
    ...payload,
  };
}

