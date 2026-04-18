import api from "./api";

// Route-related API calls for drivers and passengers.

export async function fetchDriverRoutes() {
  const res = await api.get("/drivers/routes");
  return res.data;
}

export async function searchRoutes(payload) {
  const res = await api.post("/routes/search", payload);
  return res.data;
}

export async function publishRoute(payload) {
  const res = await api.post("/drivers/create-route", payload);
  return res.data;
}

export async function markDriverLocation({ routeId, lat, lng, datetime, sessionId }) {
  const res = await api.post("/drivers/mark-location", { routeId, lat, lng, datetime, sessionId });
  return res.data;
}

