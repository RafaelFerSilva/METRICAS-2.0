import { tokenService } from "./tokenService";
import { returnHeaders } from "../../services/api";
import axios from "axios";

export const authService = {
  async login({ organization, token }) {
    return await axios
      .get(`https://dev.azure.com/${organization}/_apis/projects?api-version=7.1`, {
        headers: returnHeaders(token)
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Organization ou Token inválidos!!!");
        }
        tokenService.save(organization, token);
        return response.data.value;
      });
  },

  async getSession(ctx) {
    const token = tokenService.getToken(ctx);
    const organization = tokenService.getOrganization(ctx);
    const project_id = tokenService.getProjectId(ctx);
  
    if (!token || !organization || !project_id) {
      throw new Error("Missing authentication details!");
    }
  
    try {
      const response = await axios.get(`https://dev.azure.com/${organization}/_apis/projects?api-version=7.1`, {
        headers: returnHeaders(token)
      });
  
      if (response.status !== 200) {
        throw new Error("Não Autorizado!!!");
      }
  
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
