import { AUTHENTICATION_BASE_URL } from "@/config";
import { LoginData } from "@/types";
import axios from "axios";

export async function appleLogin(id_token: string): Promise<LoginData> {
  console.log(AUTHENTICATION_BASE_URL + "/v1/auth/login/apple");
  const res = await axios.post(
    AUTHENTICATION_BASE_URL + "/v1/auth/login/apple",
    { token: id_token }
  );
  console.log(res?.data?.data);
  return res?.data?.data;
}
