import { useQuery, useMutation } from "react-query";
import { GetTestRunsUseCase } from "../../core/application/use-cases/get-test-runs.use-case";
import { GetTestRunDetailsUseCase } from "../../core/application/use-cases/get-test-run-details.use-case";
import { GetTestRunResultsUseCase } from "../../core/application/use-cases/get-test-run-results.use-case";
import { AzureDevOpsRunGateway } from "../../infrastructure/gateways/azure-devops-run.gateway";

const gateway = new AzureDevOpsRunGateway();
const getTestRunsUseCase = new GetTestRunsUseCase(gateway);
const getTestRunDetailsUseCase = new GetTestRunDetailsUseCase(gateway);
const getTestRunResultsUseCase = new GetTestRunResultsUseCase(gateway);

export function useTestRuns(automated: boolean = true, includeDetails: boolean = true, buildId?: string) {
    return useQuery(
        ['testRuns', automated, includeDetails, buildId],
        () => getTestRunsUseCase.execute(automated, includeDetails, buildId),
        {
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    );
}

export function useTestRunDetails() {
    return useMutation((runId: string) => getTestRunDetailsUseCase.execute(runId));
}

export function useTestRunResults() {
    return useMutation((runId: string) => getTestRunResultsUseCase.execute(runId));
}

