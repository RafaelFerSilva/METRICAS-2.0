import { IPipelineRepository } from '../../domain/repositories/pipeline-repository.interface';
import { PipelineRun } from '../../domain/entities/pipeline-run.entity';

export class GetPipelineRunsUseCase {
    constructor(private pipelineRepo: IPipelineRepository) { }

    async execute(pipelineId: string): Promise<PipelineRun[]> {
        if (!pipelineId) {
            throw new Error("Pipeline ID is required");
        }
        return this.pipelineRepo.getRuns(pipelineId);
    }
}
