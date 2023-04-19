import { STAMP_API_BASE_URL } from "@/config";
import axios from "axios";

export async function oauthAuthorize(query: string, sessionToken: string) {
  const authorizeRes = await axios.get(
    STAMP_API_BASE_URL + "/v1/oauth/authorize?" + query,
    {
      headers: {
        "x-session-token": sessionToken,
      },
    }
  );
  console.log({ authorizeRes });
  return authorizeRes?.data?.data;
}
