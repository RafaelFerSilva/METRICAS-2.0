import { Task } from "../entities/sprint.entity";

export interface SprintMetrics {
    // Separated User Stories (direct vs related)
    directUserStories: Task[];      // User Stories directly in the sprint
    relatedUserStories: Task[];     // User Stories related via tasks (from other sprints)

    userStories: Task[];  // All User Stories combined (kept for backward compatibility)
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

    // Separated story points
    completedStoryPoints: number;        // Story points from direct USs
    totalStoryPoints: number;            // Total story points from direct USs
    relatedCompletedStoryPoints: number; // Story points from related USs
    relatedTotalStoryPoints: number;     // Total story points from related USs

    userStoriesRate: number;
    completionRate: number;
    storyPointsRate: number;
    usRate: number;
    defectsRate: number;
    bugsRate: number;
    problemsRate: number;
    tasksItensRate: number;

    // Cycle Time and Lead Time metrics (in days)
    averageCycleTime: number;
    averageLeadTime: number;

    // Detailed Stats (Percentiles & Control Limits)
    cycleTimeStats: { avg: number, p50: number, p75: number, p95: number, stdDev: number, ucl: number, lcl: number };
    leadTimeStats: { avg: number, p50: number, p75: number, p95: number, stdDev: number, ucl: number, lcl: number };
}
