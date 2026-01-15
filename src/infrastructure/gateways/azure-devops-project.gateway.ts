import { IProjectRepository } from '../../core/domain/repositories/project-repository.interface';
import { Project } from '../../core/domain/entities/project.entity';
import { getAxiosClient } from '../http/axios-client';
import { tokenService } from '../../services/auth/tokenService';

export class AzureDevOpsProjectGateway implements IProjectRepository {
    async getProjects(): Promise<Project[]> {
        const organization = tokenService.getOrganization();

        try {
            const response = await getAxiosClient().get(`https://dev.azure.com/${organization}/_apis/projects?api-version=7.1`);

            if (response.status === 200 && response.data?.value) {
                return response.data.value.map((item: any) => this.mapToEntity(item));
            }
            return [];
        } catch (error) {
            console.error("Error fetching projects:", error);
            throw error;
        }
    }

    private mapToEntity(raw: any): Project {
        return {
            id: raw.id,
            name: raw.name,
            url: raw.url,
            state: raw.state,
            revision: raw.revision,
            visibility: raw.visibility,
            lastUpdateTime: raw.lastUpdateTime,
            description: raw.description
        };
    }
}
