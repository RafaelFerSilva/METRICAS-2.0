import { useMutation } from "react-query";
import { GetSprintComparisonUseCase } from "../../core/application/use-cases/get-sprint-comparison.use-case";
import { AzureDevOpsSprintGateway } from "../../infrastructure/gateways/azure-devops-sprint.gateway";
import { SprintMetricsService } from "../../core/domain/services/sprint-metrics.service";
import { Sprint } from "../../core/domain/entities/sprint.entity";

// DI
const sprintGateway = new AzureDevOpsSprintGateway();
const metricsService = new SprintMetricsService();
const getSprintComparisonUseCase = new GetSprintComparisonUseCase(sprintGateway, metricsService);

export function useSprintComparison() {
    const fetchComparisonMutation = useMutation(
        ({ teamId, sprints }: { teamId: string, sprints: Sprint[] }) =>
            getSprintComparisonUseCase.execute(teamId, sprints)
    );

    return {
        fetchComparison: fetchComparisonMutation.mutateAsync,
        comparisonData: fetchComparisonMutation.data,
        isLoading: fetchComparisonMutation.isLoading,
        error: fetchComparisonMutation.error,
        reset: fetchComparisonMutation.reset
    };
}
