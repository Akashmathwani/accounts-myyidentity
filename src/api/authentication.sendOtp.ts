import { AUTHENTICATION_BASE_URL, STAMP_API_BASE_URL } from "@/config";
import axios from "axios";

export async function sendOTP(phone: string) {
  const query = `/v1/auth/generate-otp`;
  const res = await axios.post(AUTHENTICATION_BASE_URL + query, {
    phone_number: phone,
  });
  return res?.data;
}
