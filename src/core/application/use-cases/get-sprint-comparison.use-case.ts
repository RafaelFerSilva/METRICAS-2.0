import { ISprintRepository } from '../../domain/repositories/sprint-repository.interface';
import { SprintMetricsService } from '../../domain/services/sprint-metrics.service';
import { SprintComparisonDTO } from '../dtos/sprint-comparison.dto';
import { Sprint } from '../../domain/entities/sprint.entity';

export class GetSprintComparisonUseCase {
    private tagsNotExpected = ["Não prevista", "Não previsto"];

    constructor(
        private sprintRepository: ISprintRepository,
        private metricsService: SprintMetricsService
    ) { }

    async execute(teamId: string, sprints: Sprint[]): Promise<SprintComparisonDTO[]> {
        const promises = sprints.map(async (sprint) => {
            if (sprint.attributes.timeFrame === 'future') return null;

            const tasks = await this.sprintRepository.getSprintTasks(teamId, sprint.id);
            if (!tasks || tasks.length === 0) return null;

            const dto: SprintComparisonDTO = {
                id: sprint.id,
                name: sprint.name,
                userStories: this.metricsService.returnAllTasksByWorkItemType(tasks, "User Story").length,
                bugs: this.metricsService.returnAllTasksByWorkItemType(tasks, "Bug").length,
                defects: this.metricsService.returnAllTasksByWorkItemType(tasks, "Defect").length,
                problems: this.metricsService.returnAllTasksByWorkItemType(tasks, "Problems").length,
                improvements: this.metricsService.returnAllTasksByWorkItemTag(tasks, "Melhoria").length,
                notExpected: this.metricsService.returnTagsList(this.tagsNotExpected, tasks).length,
                points: this.metricsService.returnTasksPoints(
                    this.metricsService.returnAllTasksByWorkItemType(tasks, "User Story")
                ),
                pointsDelivery: this.metricsService.returnTasksPoints(
                    this.metricsService.returnAllTasksByWorkItemType(
                        this.metricsService.returnTasksCompleted(tasks),
                        "User Story"
                    )
                ),
                pointsNotDelivered: this.metricsService.returnTasksPoints(
                    this.metricsService.returnAllTasksByWorkItemType(
                        this.metricsService.returnTasksNotCompleted(tasks),
                        "User Story"
                    )
                ),
            };
            return dto;
        });

        const results = await Promise.all(promises);
        const validResults = results.filter((item): item is SprintComparisonDTO => item !== null);

        // Match legacy behavior: the component reversed the array. 
        // We will return in chronological or input order? 
        // Existing fetches ALL and then reverses. 
        // If the input `sprints` is recent-first or old-first?
        // Usually Azure gives recent first? Or old first? 
        // `getSprints` does `response.data.value.reverse()`.
        // So `sprints` input to this UseCase is likely "Reverse Chronological" (Newest first).
        // Then `CompareSprints` reverses `summaryData`?
        // `summaryData.reverse()` suggests it wants Chronological for charts.

        return validResults.reverse();
    }
}
