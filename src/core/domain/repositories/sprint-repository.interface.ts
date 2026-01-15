import { Sprint, Task } from '../entities/sprint.entity';

export interface ISprintRepository {
    getSprints(teamId: string, projectId: string): Promise<Sprint[]>;
    getSprintTasks(teamId: string, sprintId: string): Promise<Task[]>;

    // ✅ NEW: Get User Stories by IDs (for fetching parent USs from other sprints)
    getUserStoriesByIds(ids: string[]): Promise<Task[]>;
}
