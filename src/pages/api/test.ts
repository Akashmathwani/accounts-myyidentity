import { AUTHENTICATION_BASE_URL, STAMP_API_BASE_URL } from "@/config";
import axios from "axios";

import { ClientJS } from "clientjs";
const client = new ClientJS();
const fingerprint = client.getFingerprint();

export async function testDn() {
  console.log({ fingerprint });
  //   const query = `/v1/auth/login`;
  //   const res = await axios.post(AUTHENTICATION_BASE_URL + query, {
  //     email: input.email,
  //     password: input.password,
  //   });
  //   return res?.data;
}
