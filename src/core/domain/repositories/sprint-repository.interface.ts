import { Sprint, Task } from '../entities/sprint.entity';

export interface ISprintRepository {
    getSprints(teamId: string, projectId: string): Promise<Sprint[]>;
    getSprintTasks(teamId: string, sprintId: string): Promise<Task[]>;
}
