import axios from "axios";
import { TransactionSubmitData } from "../validation/transaction";
const baseUrl = "http://localhost:4000/api/v1";

const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true, 
  });
  
  export const getTransactionsApi = async () => {
      const response = await api.get("/transaction");
      return response;
  };
  
export const createTransactionApi = async (transactionData: TransactionSubmitData) => {
    const response = await api.post("/transaction", transactionData);
    return response;
};
export const getTransactionByIdApi = async (id: number) => {
    const response = await api.get(`/transaction/${id}`);
    return response;
};