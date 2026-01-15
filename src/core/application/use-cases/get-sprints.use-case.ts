import { ISprintRepository } from '../../domain/repositories/sprint-repository.interface';
import { Sprint } from '../../domain/entities/sprint.entity';

export class GetSprintsUseCase {
    constructor(private sprintRepo: ISprintRepository) { }

    async execute(teamId: string, projectId: string): Promise<Sprint[]> {
        return this.sprintRepo.getSprints(teamId, projectId);
    }
}
