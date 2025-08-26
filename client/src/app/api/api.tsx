import axios from "axios";
import { RegisterSubmitData } from "../validation/register";
import { LoginSubmitData } from "../validation/login";

const baseUrl = "http://localhost:4000/api/v1";


const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, 
});

export async function submitData(data: RegisterSubmitData) {
  const res = await api.post("/users", data, {
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true,
  });
  return res;
}

export async function loginUser(data: LoginSubmitData) {
  const res = await api.post("/auth/login", data, {
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true,
  });
  return res;
}

export async function logoutUser() {
  try {
    const res = await api.post("/auth/logout", {}, {
      validateStatus: () => true,
    });
    return res;
  } catch (error) {
    console.error('Logout API error:', error);
  }
}
export async function getCurrentUser() {
  const res = await api.get("/auth/me", {
    validateStatus: () => true,
  });
  return res;
}
