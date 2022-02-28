import axios from "axios";

export function setupAPIMetrics() {
  const headers = {
    Authorization: `Basic ${Buffer.from(`PAT:${process.env.NEXT_PUBLIC_TOKEN}`).toString("base64")}`,
    "X-TFS-FedAuthRedirect": "Suppress",
  };

  const axiosInstance = axios.create({
    baseURL: `https://dev.azure.com/${process.env.NEXT_PUBLIC_ORGANIZATION}/${process.env.NEXT_PUBLIC_PROJECT}/_apis/`,
    headers: headers,
  });

  return axiosInstance
}
