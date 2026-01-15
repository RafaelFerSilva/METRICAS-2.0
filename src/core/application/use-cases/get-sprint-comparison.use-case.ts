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

    async execute(teamId: string, sprints: Sprint[], filters?: { tags?: string[] }): Promise<SprintComparisonDTO[]> {
        const promises = sprints.map(async (sprint) => {
            if (sprint.attributes.timeFrame === 'future') return null;

            let tasks = await this.sprintRepository.getSprintTasks(teamId, sprint.id);
            if (!tasks || tasks.length === 0) return null;

            if (filters?.tags?.length) {
                tasks = tasks.filter(task => {
                    const taskTags = (task.Tags || "").split("; ");
                    return filters.tags!.some(tag => taskTags.includes(tag));
                });
            }

            if (tasks.length === 0) return null;
            const metrics = this.metricsService.calculateMetrics(tasks);

            const dto: SprintComparisonDTO = {
                id: sprint.id,
                name: sprint.name,
                userStories: metrics.directUserStories.length,
                bugs: metrics.bugs.length,
                defects: metrics.defects.length,
                problems: metrics.problems.length,
                improvements: this.metricsService.returnAllTasksByWorkItemTag(tasks, "Melhoria").length,
                notExpected: this.metricsService.returnTagsList(this.tagsNotExpected, tasks).length,
                points: metrics.completedStoryPoints, // Assuming this maps to 'points' (or total?) - Checking legacy
                pointsDelivery: metrics.completedStoryPoints,
                pointsNotDelivered: metrics.totalStoryPoints - metrics.completedStoryPoints,

                // ✅ NEW: Trend Metrics
                avgCycleTime: metrics.averageCycleTime,
                avgLeadTime: metrics.averageLeadTime,
                cycleTimeP95: metrics.cycleTimeStats.p95,
                leadTimeP95: metrics.leadTimeStats.p95,
                cycleTimeUCL: metrics.cycleTimeStats.ucl,
                cycleTimeLCL: metrics.cycleTimeStats.lcl,
                leadTimeUCL: metrics.leadTimeStats.ucl,
                leadTimeLCL: metrics.leadTimeStats.lcl
            };
            return dto;
        });

        const results = await Promise.all(promises);
        const validResults = results.filter((item): item is SprintComparisonDTO => item !== null);

        return validResults.reverse();
    }
}
