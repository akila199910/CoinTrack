import axios from "axios";

const baseUrl = "http://localhost:4000/api/v1";


const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, 
});

export const getCategoriesApi = async () => {
    const response = await api.get("/category");
    return response;
  };