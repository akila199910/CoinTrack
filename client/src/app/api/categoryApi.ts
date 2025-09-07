import axios from "axios";
import { CategorySubmitData } from "../validation/category";
const baseUrl = "http://localhost:4000/api/v1";


const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, 
});

export const getCategoriesApi = async () => {
    const response = await api.get("/category");
    return response;
};

export const createCategoryApi = async (categoryData: CategorySubmitData) => {
    const response = await api.post("/category", categoryData);
    return response;
};