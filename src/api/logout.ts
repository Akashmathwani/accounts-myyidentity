import { AUTHENTICATION_BASE_URL, STAMP_API_BASE_URL } from "@/config";
import axios from "axios";

export async function authLogout(token: string) {
  const query = `/v1/auth/logout`;
  try {
    const res = await axios.post(AUTHENTICATION_BASE_URL + query, {
      session_token: token,
    });
    return res?.data;
  } catch (e) {
    console.log(e);
    return null;
  }
}
