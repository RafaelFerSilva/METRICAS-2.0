import { useQuery } from 'react-query';
import { GetProjectsUseCase } from '../../core/application/use-cases/get-projects.use-case';
import { AzureDevOpsProjectGateway } from '../../infrastructure/gateways/azure-devops-project.gateway';

const projectGateway = new AzureDevOpsProjectGateway();
const getProjectsUseCase = new GetProjectsUseCase(projectGateway);

export function useProjects() {
    return useQuery(
        ['projects'],
        () => getProjectsUseCase.execute(),
        {
            staleTime: 1000 * 60 * 30, // 30 minutes
            retry: 1,
        }
    );
}
