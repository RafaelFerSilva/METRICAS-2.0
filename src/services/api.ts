import axios from "axios";

export function setupAPIMetrics({organization, project_id, token }) {
  const headers = {
    Authorization: `Basic ${Buffer.from(`PAT:${token}`).toString("base64")}`,
    "X-TFS-FedAuthRedirect": "Suppress",
  };

  const axiosInstance = axios.create({
    baseURL: `https://dev.azure.com/${organization}/${project_id}/_apis/`,
    headers: headers,
  });

  return axiosInstance

}
