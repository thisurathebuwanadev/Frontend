import api from "./api";

export async function fetchVehicles() {
  const res = await api.get("/drivers/vehicles");
  return res.data.data;
}

export async function addVehicle(vehicleData) {
  const res = await api.post("/drivers/add-vehicle", vehicleData);
  return res.data.data;
}
