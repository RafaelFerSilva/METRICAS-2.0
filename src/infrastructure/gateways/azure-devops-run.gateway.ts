import { IRunRepository } from "../../core/domain/repositories/run-repository.interface";
import { Run, RunDetails, RunTestResult } from "../../core/domain/entities/run.entity";
import { getAxiosClient } from "../http/axios-client";

export class AzureDevOpsRunGateway implements IRunRepository {
    async getTestRuns(automated: boolean = true, includeDetails: boolean = true, buildId?: string): Promise<Run[]> {
        let url = `test/runs?automated=${automated}&includeRunDetails=${includeDetails}&api-version=7.1`;
        if (buildId) {
            url += `&buildIds=${buildId}`;
        }
        try {
            const response = await getAxiosClient().get(url);
            if (response.status === 200 && response.data.value) {
                return response.data.value.map((run: any) => {
                    const stats = run.runStatistics || [];
                    const getStat = (outcome: string) => {
                        const stat = stats.find((s: any) => s.outcome === outcome);
                        return stat ? stat.count : 0;
                    };

                    return {
                        id: run.id.toString(),
                        name: run.name,
                        url: run.url,
                        finishedDate: run.finishedDate,
                        createdDate: run.createdDate,
                        result: run.runStatistics ? run.runStatistics[0]?.outcome : (run.state || "Unknown"),
                        state: run.state,
                        buildId: run.build?.id || "",
                        totalTests: run.totalTests || 0,
                        passedTests: getStat('Passed'),
                        incompleteTests: getStat('Incomplete'),
                        unanalyzedTests: getStat('Unanalyzed'),
                        notApplicableTests: getStat('NotApplicable')
                    };
                });
            }
        } catch (error) {
            console.error("Error fetching test runs:", error);
        }
        return [];
    }

    async getTestRunDetails(runId: string): Promise<RunDetails> {
        try {
            const response = await getAxiosClient().get(`test/Runs/${runId}?api-version=7.1`);
            if (response.status === 200) {
                const data = response.data;
                const stats = data.runStatistics || [];

                const getStat = (outcome: string) => {
                    const stat = stats.find((s: any) => s.outcome === outcome);
                    return stat ? stat.count : 0;
                };

                return {
                    id: data.id.toString(),
                    name: data.name,
                    url: data.url,
                    finishedDate: data.finishedDate,
                    createdDate: data.createdDate,
                    result: data.state, // Or derived result
                    state: data.state,
                    buildId: data.build?.id || "",
                    pipelineId: data.build?.id || "", // Assuming pipelineId ~ buildId in this context or mapped properly
                    totalTests: data.totalTests || 0,
                    passedTests: getStat('Passed'),
                    incompleteTests: getStat('Incomplete'), // 'Incomplete' or similar
                    unanalyzedTests: getStat('Unanalyzed') || 0,
                    notApplicableTests: getStat('NotApplicable') || 0,
                    postProcessState: data.postProcessState || ""
                };
            }
        } catch (error) {
            console.error(`Error fetching run details for ${runId}:`, error);
        }
        throw new Error(`Failed to fetch run details for ${runId}`);
    }

    async getTestRunResults(runId: string): Promise<RunTestResult[]> {
        try {
            const response = await getAxiosClient().get(`test/Runs/${runId}/results?api-version=7.1`);
            if (response.status === 200 && response.data.value) {
                return response.data.value.map((test: any) => ({
                    id: test.id,
                    automatedTestName: test.automatedTestName,
                    automatedTestStorage: test.automatedTestStorage,
                    buildId: test.build?.id || "",
                    startedDate: test.startedDate,
                    completedDate: test.completedDate,
                    createdDate: test.createdDate,
                    durationInMs: test.durationInMs,
                    outcome: test.outcome,
                    priority: test.priority,
                    state: test.state,
                    testCaseReferenceId: test.testCaseReferenceId,
                    testRunId: test.testRun?.id || "",
                    errorMessage: test.errorMessage || ""
                }));
            }
        } catch (error) {
            console.error(`Error fetching results for run ${runId}:`, error);
        }
        return [];
    }
}
