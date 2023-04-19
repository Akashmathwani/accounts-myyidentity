import { AUTHENTICATION_BASE_URL, STAMP_API_BASE_URL } from "@/config";
import { LoginData } from "@/types";
import axios from "axios";

export async function authLogin(input: {
  email: string;
  password: string;
}): Promise<LoginData> {
  const query = `/v1/auth/login`;
  const res = await axios.post(AUTHENTICATION_BASE_URL + query, {
    email: input.email,
    password: input.password,
  });
  return res?.data?.data;
}
