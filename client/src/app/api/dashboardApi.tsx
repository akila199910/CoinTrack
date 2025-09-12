import axios from "axios";

const baseUrl = "http://localhost:4000/api/v1";


const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export const getDashboardDataApi = async (fromDate?: string, toDate?: string) => {

  let url = `/dashboard?fromDate=${fromDate}&toDate=${toDate}`;
  const response = await api.get(url);
  return response;
};

