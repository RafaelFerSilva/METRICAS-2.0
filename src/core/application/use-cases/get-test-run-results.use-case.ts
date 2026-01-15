import { IRunRepository } from "../../domain/repositories/run-repository.interface";
import { RunTestResult } from "../../domain/entities/run.entity";

export class GetTestRunResultsUseCase {
    constructor(private runRepository: IRunRepository) { }

    async execute(runId: string): Promise<RunTestResult[]> {
        return this.runRepository.getTestRunResults(runId);
    }
}
