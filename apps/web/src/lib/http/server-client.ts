import { cookies } from "next/headers";
import { HttpClient } from "./http-client";

export async function createServerHttpClient() {
  return new HttpClient({
    baseUrl: process.env.API_URL!,
    getToken: async () => (await cookies()).get("token")?.value ?? null,
    fetchOptions: {
      cache: "no-store",
    },
  });
}
