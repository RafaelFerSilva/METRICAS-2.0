import { useQuery } from 'react-query';
import { GetPipelineRunsUseCase } from '../../core/application/use-cases/get-pipeline-runs.use-case';
import { AzureDevOpsPipelineGateway } from '../../infrastructure/gateways/azure-devops-pipeline.gateway';

// Instantiate dependencies (Simple DI)
const pipelineGateway = new AzureDevOpsPipelineGateway();
const getPipelineRunsUseCase = new GetPipelineRunsUseCase(pipelineGateway);

export function usePipelineRuns(pipelineId: string) {
    return useQuery(
        ['pipeline-runs', pipelineId],
        () => getPipelineRunsUseCase.execute(pipelineId),
        {
            enabled: !!pipelineId, // Only run if pipelineId is present
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    );
}
