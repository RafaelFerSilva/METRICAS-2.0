import { setupAPIMetrics } from '../../services/api';
import { tokenService } from '../../services/auth/tokenService';
import { AxiosInstance } from 'axios';

let client: AxiosInstance | null = null;

export const getAxiosClient = (): AxiosInstance => {
    if (!client) {
        const token = tokenService.getToken();
        const project_id = tokenService.getProjectId();
        const organization = tokenService.getOrganization();

        client = setupAPIMetrics({ organization, project_id, token });
    }
    return client;
};
