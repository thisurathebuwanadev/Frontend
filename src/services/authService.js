import api from "./api";
// import { mockUsers } from "../data/mockUsers";

// TEMPORARY FRONTEND AUTH SERVICE
// This file simulates authentication until backend integration.
// Replace the temporary blocks and uncomment the API calls when the backend is connected.

export async function loginUser(credentials) {
  // REAL BACKEND LOGIN
  // Uncomment this block and remove the mock logic below once the backend is ready.
  //
  const response = await api.post("/auth/login", credentials);
  return {
    id: response.data.data.userId,
    name: response.data.data.name,
    email: response.data.data.email,
    role: response.data.data.role,
    token: response.data.data.accessToken
  };

  // TEMPORARY FRONTEND LOGIN
  // This block simulates authentication until backend integration.
  // Remove this section and uncomment the API call above when backend is connected.
  // const { email, password } = credentials;
  // const normalizedEmail = email.trim().toLowerCase();
  //
  // const user = mockUsers.find(
  //   (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  // );
  //
  // if (!user) {
  //   const error = new Error("Invalid email or password.");
  //   error.code = "INVALID_CREDENTIALS";
  //   throw error;
  // }
  //
  // return {
  //   id: normalizedEmail,
  //   name: user.name,
  //   email: user.email,
  //   role: user.role,
  //   token: "mock-token",
  // };
}

export async function logoutUser() {
  // REAL BACKEND LOGOUT
  // await api.post("/auth/logout");

  // TEMPORARY LOGOUT
  // Nothing to do yet – state is cleared in the AuthProvider.
}

