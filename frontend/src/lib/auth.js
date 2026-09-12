import { apiRequest } from "./api";

export async function registerUser(email, password) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function loginUser(email, password) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function getCurrentUser() {
  return apiRequest("/api/auth/me", {
    method: "GET",
  });
}

export async function logoutUser() {
  return apiRequest("/api/auth/logout", {
    method: "POST",
  });
}