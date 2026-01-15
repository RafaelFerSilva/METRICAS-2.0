import { ISprintRepository } from '../../domain/repositories/sprint-repository.interface';
import { SprintMetricsService } from '../../domain/services/sprint-metrics.service';
import { SprintMetrics } from '../../domain/value-objects/sprint-metrics.value-object';
import { Task } from '../../domain/entities/sprint.entity';

export class GetSprintReportUseCase {
    constructor(
        private sprintRepo: ISprintRepository,
        private metricsService: SprintMetricsService
    ) { }

    async execute(teamId: string, sprintId: string, projectId: string): Promise<{ tasks: Task[], metrics: SprintMetrics }> {
        const tasks = await this.sprintRepo.getSprintTasks(teamId, sprintId);
        const metrics = this.metricsService.calculateMetrics(tasks);

        return {
            tasks,
            metrics
        };
    }
}
