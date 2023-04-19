import { AUTHENTICATION_BASE_URL, STAMP_API_BASE_URL } from "@/config";
import axios from "axios";

export async function authSignUp(input: { email: string; password: string }) {
  const query = `/v1/auth/signup`;
  const res = await axios.post(AUTHENTICATION_BASE_URL + query, {
    email: input.email,
    password: input.password,
  });
  return res?.data;
}
