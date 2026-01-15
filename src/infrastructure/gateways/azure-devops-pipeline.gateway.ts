import { IPipelineRepository } from '../../core/domain/repositories/pipeline-repository.interface';
import { PipelineRun } from '../../core/domain/entities/pipeline-run.entity';
import { getAxiosClient } from '../http/axios-client';

export class AzureDevOpsPipelineGateway implements IPipelineRepository {
    async getRuns(pipelineId: string): Promise<PipelineRun[]> {
        try {
            const response = await getAxiosClient().get(
                `/pipelines/${pipelineId}/runs?api-version=7.1-preview.1`
            );

            if (response.status === 200 && response.data?.value) {
                return response.data.value.map((item: any) => this.mapToEntity(item));
            }
            return [];
        } catch (error) {
            console.error("Error fetching pipeline runs:", error);
            throw error;
        }
    }

    private mapToEntity(raw: any): PipelineRun {
        return {
            id: raw.id,
            name: raw.name,
            url: raw.url,
            finishedDate: raw.finishedDate,
            createdDate: raw.createdDate,
            result: raw.result,
            state: raw.state
        };
    }
}
