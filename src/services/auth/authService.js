import { tokenService } from "./tokenService";
import { setupAPIMetrics } from "../../services/api";

export const authService = {
  async login({ organization, project_id, token }) {

    const axiosInstance = setupAPIMetrics({ organization, project_id, token })
    return axiosInstance
      .get(`https://dev.azure.com/${organization}/_apis/projects/${project_id}/teams?api-version=6.0`)
      .then((response) => {
        if (!response.status === 200) throw new Error("Organization, Project ID ou Token inválidos!!!");
        tokenService.save(organization, project_id, token)
      })
  },

  async getSession(ctx) {
    const token = tokenService.getToken(ctx)
    const organization = tokenService.getOrganization(ctx)
    const project_id = tokenService.getProjectId(ctx)
    const axiosInstance = setupAPIMetrics({organization, project_id, token});

    return axiosInstance
      .get(`https://dev.azure.com/${organization}/_apis/projects?api-version=6.0-preview.3`)
      .then((response) => {
        if (!response.status === 200) throw new Error("Não Autorizado!!!");
        return response.data.value[0];
      });
  },
};
