import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.8.155:3000",
  timeout: 5000,
});

api.interceptors.request.use(
  async (config) => {
    // TEMPORARY TOKEN ATTACHMENT
    // Replace this with real token retrieval (e.g. AsyncStorage) when backend is ready.
    const token = null;

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // CENTRALIZED ERROR HANDLING
    // You can inspect error.response?.status here and perform global actions
    // such as logging out on 401, showing a toast, etc.
    return Promise.reject(error);
  }
);

export default api;

