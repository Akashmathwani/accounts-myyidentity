import cacheData from "memory-cache";

async function fetchsetCodeVerifierWithCache(code_verifier: string) {
  const value = cacheData.get(code_verifier);
  if (value) {
    return value;
  } else {
    const hours = 1;
    const res = await fetch(code_verifier);
    const data = await res.json();
    cacheData.put(code_verifier, data, hours * 1000 * 60 * 60);
    return data;
  }
}
