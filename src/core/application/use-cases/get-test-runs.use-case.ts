import { IRunRepository } from "../../domain/repositories/run-repository.interface";
import { Run } from "../../domain/entities/run.entity";

export class GetTestRunsUseCase {
    constructor(private runRepository: IRunRepository) { }

    async execute(automated: boolean = true, includeDetails: boolean = true, buildId?: string): Promise<Run[]> {
        return this.runRepository.getTestRuns(automated, includeDetails, buildId);
    }
}
