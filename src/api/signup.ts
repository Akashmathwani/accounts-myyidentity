import { STAMP_API_BASE_URL } from "@/config";
import axios from "axios";
export async function signUp(input: { email: string; password: string }) {
  const res = await axios.post(STAMP_API_BASE_URL + "v1/signup", {
    email: input.email,
    password: input.password,
  });
}
