import { useQuery, useMutation, useQueryClient } from 'react-query';
import { AzureDevOpsSprintGateway } from '../../infrastructure/gateways/azure-devops-sprint.gateway';
import { GetSprintsUseCase } from '../../core/application/use-cases/get-sprints.use-case';
import { GetSprintReportUseCase } from '../../core/application/use-cases/get-sprint-report.use-case';
import { SprintMetricsService } from '../../core/domain/services/sprint-metrics.service';
import { tokenService } from '../../services/auth/tokenService';

// DI instantiation
const sprintGateway = new AzureDevOpsSprintGateway();
const metricsService = new SprintMetricsService();
const getSprintsUseCase = new GetSprintsUseCase(sprintGateway);
const getSprintReportUseCase = new GetSprintReportUseCase(sprintGateway, metricsService);

export function useSprintReport() {
    const queryClient = useQueryClient();
    const projectId = tokenService.getProjectId();

    // Query for Sprints (Dependent on Team Selection)
    // We'll expose a wrapper or separate hook for sprints if needed, 
    // but for now a mutation or a query enabled by state is fine.
    // Given the UI flows: Select Team -> Load Sprints.

    const fetchSprintsMutation = useMutation(
        (teamId: string) => getSprintsUseCase.execute(teamId, projectId)
    );

    const fetchReportMutation = useMutation(
        ({ teamId, sprintId }: { teamId: string, sprintId: string }) =>
            getSprintReportUseCase.execute(teamId, sprintId, projectId)
    );

    return {
        // Sprints
        fetchSprints: fetchSprintsMutation.mutateAsync,
        sprints: fetchSprintsMutation.data,
        isLoadingSprints: fetchSprintsMutation.isLoading,
        sprintsError: fetchSprintsMutation.error,
        resetSprints: fetchSprintsMutation.reset,

        // Report
        fetchReport: fetchReportMutation.mutateAsync,
        reportData: fetchReportMutation.data,
        isLoadingReport: fetchSprintsMutation.isLoading || fetchReportMutation.isLoading,
        reportError: fetchReportMutation.error,
        resetReport: fetchReportMutation.reset
    };
}
