import axios from "axios";

const baseUrl = "http://localhost:4000/api/v1";


const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export const getDashboardDataApi = async (period?: string, startDate?: string, endDate?: string) => {

  let url = '/dashboard';
  if (period) {
    url += `?period=${period}`;
  }
  else if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }

  const response = await api.get(url);
  return response;
};

