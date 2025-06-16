import axios, { AxiosRequestHeaders } from "axios";

export const returnProjects = async (organization: string, headers: AxiosRequestHeaders) => {
  const projectId = await axios.get(`https://dev.azure.com/${organization}/_apis/projects`, { headers });
  return projectId.data.value
}

export const returnHeaders = (token: string) => {
  return {
    Authorization: `Basic ${Buffer.from(`PAT:${token}`).toString("base64")}`,
    "X-TFS-FedAuthRedirect": "Suppress",
  };
}

export function setupAPIMetrics({organization, project_id, token }) {
  const projects = returnProjects(organization, returnHeaders(token))

  const axiosInstance = axios.create({
    baseURL: `https://dev.azure.com/${organization}/${project_id}/_apis/`,
    headers: returnHeaders(token),
  });

  return axiosInstance

}
