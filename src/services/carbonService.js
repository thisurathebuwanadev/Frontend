import api from "./api";

export async function fetchCarbonSavings() {
  const res = await api.get("/carbon/savings");
  return res.data.data;
}
