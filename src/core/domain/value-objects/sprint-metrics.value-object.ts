import { Task } from "../entities/sprint.entity";

export interface SprintMetrics {
    userStories: Task[];
    bugs: Task[];
    taskItems: Task[];
    defects: Task[];
    problems: Task[];
    completedTasks: Task[];
    userStoryStatesData: any[]; // Ideally typed better but following existing structure
    bugStatesData: any[];
    defectStatesData: any[];
    problemsStateData: any[];
    taskStatesData: any[];
    completedUserStories: number;
    completedDefects: number;
    completedBugs: number;
    completedProblems: number;
    completedTasksItems: number;
    completedStoryPoints: number;
    totalStoryPoints: number;
    userStoriesRate: number;
    completionRate: number;
    storyPointsRate: number;
    usRate: number;
    defectsRate: number;
    bugsRate: number;
    problemsRate: number;
    tasksItensRate: number;
}
