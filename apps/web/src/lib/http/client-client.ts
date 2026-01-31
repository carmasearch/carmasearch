import { HttpClient } from "./http-client";

export const browserHttpClient = new HttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  getToken: () =>
    typeof window === "undefined" ? null : localStorage.getItem("token"),
});
