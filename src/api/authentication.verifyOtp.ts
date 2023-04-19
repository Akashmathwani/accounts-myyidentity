import { AUTHENTICATION_BASE_URL, STAMP_API_BASE_URL } from "@/config";
import { LoginData } from "@/types";
import axios from "axios";

export async function verifyOTP(
  phone: string,
  code: string
): Promise<LoginData> {
  const query = `/v1/auth/verify-otp`;
  const res = await axios.post(AUTHENTICATION_BASE_URL + query, {
    phone_number: phone,
    code,
  });
  return res?.data?.data;
}
