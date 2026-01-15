import { IProjectRepository } from '../../domain/repositories/project-repository.interface';
import { Project } from '../../domain/entities/project.entity';

export class GetProjectsUseCase {
    constructor(private projectRepo: IProjectRepository) { }

    async execute(): Promise<Project[]> {
        return this.projectRepo.getProjects();
    }
}
