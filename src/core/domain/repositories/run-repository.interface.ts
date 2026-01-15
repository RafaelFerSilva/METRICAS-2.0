import { Run, RunDetails, RunTestResult } from "../entities/run.entity";

export interface IRunRepository {
    getTestRuns(automated?: boolean, includeDetails?: boolean, buildId?: string): Promise<Run[]>;
    getTestRunDetails(runId: string): Promise<RunDetails>;
    getTestRunResults(runId: string): Promise<RunTestResult[]>;
}
