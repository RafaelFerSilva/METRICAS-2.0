import { PipelineRun } from '../entities/pipeline-run.entity';

export interface IPipelineRepository {
    getRuns(pipelineId: string): Promise<PipelineRun[]>;
}
