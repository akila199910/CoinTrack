import axios from "axios";
import { RegisterSubmitData } from "../validation/register";

const baseUrl = "http://localhost:4000/api/v1";

export async function submitData(data: RegisterSubmitData) {
  const res = await axios.post(baseUrl + "/users", data, {
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true, 
  });
  return res;
}