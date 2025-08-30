import axios from "axios";

const baseUrl = "http://localhost:4000/api/v1";


const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, 
});

export const getProfile = async () => {
  const response = await api.get("/users/my-profile");
  return response;
};

export const updateProfile = async (data: any) => {
  const response = await api.put("/profile", data);
  return response.data;
};

// export const deleteProfile = async () => {