import { IRunRepository } from "../../domain/repositories/run-repository.interface";
import { RunDetails } from "../../domain/entities/run.entity";

export class GetTestRunDetailsUseCase {
    constructor(private runRepository: IRunRepository) { }

    async execute(runId: string): Promise<RunDetails> {
        return this.runRepository.getTestRunDetails(runId);
    }
}
