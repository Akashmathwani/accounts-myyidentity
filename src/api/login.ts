import { STAMP_API_BASE_URL } from "@/config";
import axios from "axios";

export async function login(input: { email: string; password: string }) {
  const code_challenge =
    "_ZrpCMv-SZgGIjdaZSM5Wde2gy9CF5ZadyTmAasdicdaWHU540dssa12asddaw12" +
    Math.random() * 10;
  const query = `/v1/oauth/login?client_id=50ebd14c-3498-42b1-8143-1ee0b28bf4e8&grant_type=authorization_code&redirect_uri=http://localhost:3000/auth/callback&response_type=code&code_challenge=${code_challenge}&code_challenge_method=S256&scope=openid+profile+email&state=123sad2222asdasdasdwa&prompt=login&connection=google`;
  const res = await axios.post(STAMP_API_BASE_URL + query, {
    email: input.email,
    password: input.password,
  });
}
