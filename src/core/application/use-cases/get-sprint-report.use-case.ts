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
        // 1. Get tasks from sprint
        const sprintTasks = await this.sprintRepo.getSprintTasks(teamId, sprintId);

        // 2.  NEW: Extract parent IDs from tasks (to find related User Stories)
        const taskItems = sprintTasks.filter(t => t["Work Item Type"] === "Task");
        const parentIds = Array.from(new Set(
            taskItems
                .filter(task => task.Parent)
                .map(task => task.Parent!)
        ));

        // 3.  NEW: Fetch User Stories by parent IDs (may be from other sprints)
        const relatedUserStories = await this.sprintRepo.getUserStoriesByIds(parentIds);

        // 4. Filter only User Stories (exclude other types like Epics)
        const relatedUSsOnly = relatedUserStories.filter(us => us["Work Item Type"] === "User Story");

        // 5. Combine sprint tasks + related USs (removing duplicates)
        const directUSIds = new Set(
            sprintTasks
                .filter(t => t["Work Item Type"] === "User Story")
                .map(t => t.ID)
        );

        const uniqueRelatedUSs = relatedUSsOnly.filter(us => !directUSIds.has(us.ID));
        const allTasks = [...sprintTasks, ...uniqueRelatedUSs];

        // 6. Calculate metrics
        const metrics = this.metricsService.calculateMetrics(allTasks);

        return {
            tasks: allTasks,
            metrics
        };
    }
}
