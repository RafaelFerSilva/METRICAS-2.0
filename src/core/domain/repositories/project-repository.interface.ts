import { Project } from '../entities/project.entity';

export interface IProjectRepository {
    getProjects(): Promise<Project[]>;
}
