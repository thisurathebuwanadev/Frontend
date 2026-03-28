import api from "./api";
import { mockRideRequests } from "../data/mockRideRequests";

// Ride request and active trip APIs.

export async function fetchIncomingRideRequests() {
  // REAL API CALL (UNCOMMENT WHEN BACKEND IS READY)
  // return api.get("/driver/ride-requests").then((res) => res.data);

  // TEMPORARY FRONTEND DATA
  // This function returns mock ride requests for development.
  return mockRideRequests;
}

export async function acceptRideRequest(requestId) {
  // REAL API CALL (UNCOMMENT WHEN BACKEND IS READY)
  // return api.post(`/driver/ride-requests/${requestId}/accept`).then((res) => res.data);

  // TEMPORARY ACCEPT
  // Return the accepted request id to indicate success.
  return { id: requestId, status: "accepted" };
}

export async function createRideRequest({ routeId, pickupLatitude, pickupLongitude, pickupAddress, passengerCount }) {
  return api.post("/rides/request", { routeId, pickupLatitude, pickupLongitude, pickupAddress, passengerCount }).then((res) => res.data);
}

export async function rejectRideRequest(requestId) {
  // REAL API CALL (UNCOMMENT WHEN BACKEND IS READY)
  // return api.post(`/driver/ride-requests/${requestId}/reject`).then((res) => res.data);

  // TEMPORARY REJECT
  // Return the rejected request id to indicate success.
  return { id: requestId, status: "rejected" };
}

