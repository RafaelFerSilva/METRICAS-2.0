import { Task } from "../entities/sprint.entity";
import { SprintMetrics } from "../value-objects/sprint-metrics.value-object";

export class SprintMetricsService {
    public calculateMetrics(tasks: Task[]): SprintMetrics {
        //  NEW: Separate direct vs related User Stories
        const allUserStories = this.returnUsersStories(tasks);
        const directUserStories = allUserStories.filter(us => !us.IsExternal);
        const relatedUserStories = allUserStories.filter(us => us.IsExternal);

        const bugs = this.returnBugs(tasks);
        const taskItems = this.returnTaskItens(tasks);
        const defects = this.returnDefects(tasks);
        const problems = this.returnProblems(tasks);
        const completedTasks = this.returnTasksCompleted(tasks);

        const userStoryStatesData = this.returnStateDate(allUserStories);
        const bugStatesData = this.returnStateDate(bugs);
        const defectStatesData = this.returnStateDate(defects);
        const problemsStateData = this.returnStateDate(problems);
        const taskStatesData = this.returnStateDate(taskItems);

        const completedUserStories = this.returnCompletedUsersStoriesLenght(tasks);
        const completedDefects = this.returnCompletedDefectsLenght(tasks);
        const completedBugs = this.returnCompletedBugs(tasks);
        const completedProblems = this.returnCompletedProblemsLenght(tasks);
        const completedTasksItems = this.returncompletedTasksItems(tasks);

        // NEW: Calculate story points separately
        const completedStoryPoints = this.returncompletedStoryPoints(directUserStories);
        const totalStoryPoints = this.returntotalStoryPoints(directUserStories);
        const relatedCompletedStoryPoints = this.returncompletedStoryPoints(relatedUserStories);
        const relatedTotalStoryPoints = this.returntotalStoryPoints(relatedUserStories);

        const userStoriesRate = allUserStories.length > 0 ? (allUserStories.filter((us: any) => us.State === "Closed").length / allUserStories.length) * 100 : 0;
        const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
        const storyPointsRate = totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0;
        const usRate = allUserStories.length > 0 ? (allUserStories.filter((us: any) => us.State === "Closed").length / allUserStories.length) * 100 : 0;
        const defectsRate = defects.length > 0 ? (defects.filter((defect: any) => defect.State === "Closed").length / defects.length) * 100 : 0;
        const bugsRate = bugs.length > 0 ? (bugs.filter((bug: any) => bug.State === "Closed").length / bugs.length) * 100 : 0;
        const problemsRate = problems.length > 0 ? (problems.filter((problem: any) => problem.State === "Closed").length / problems.length) * 100 : 0;
        const tasksItensRate = taskItems.length > 0 ? (taskItems.filter((task: any) => task.State === "Closed").length / taskItems.length) * 100 : 0;

        // ✅ NEW: Calculate Cycle Time and Lead Time
        const averageCycleTime = this.calculateCycleTime(allUserStories);
        const averageLeadTime = this.calculateLeadTime(allUserStories);

        return {
            // ✅ NEW: Separated User Stories
            directUserStories,
            relatedUserStories,

            // All USs combined (backward compatibility)
            userStories: allUserStories,
            bugs,
            taskItems,
            defects,
            problems,
            completedTasks,
            userStoryStatesData,
            bugStatesData,
            defectStatesData,
            problemsStateData,
            taskStatesData,
            completedUserStories,
            completedDefects,
            completedBugs,
            completedProblems,
            completedTasksItems,

            // ✅ NEW: Separated story points
            completedStoryPoints,
            totalStoryPoints,
            relatedCompletedStoryPoints,
            relatedTotalStoryPoints,

            userStoriesRate,
            completionRate,
            storyPointsRate,
            usRate,
            defectsRate,
            bugsRate,
            problemsRate,
            tasksItensRate,

            // ✅ NEW: Cycle/Lead Time
            averageCycleTime,
            averageLeadTime
        };
    }

    // ✅ NEW: Calculate Cycle Time (In Progress → Closed)
    private calculateCycleTime(userStories: Task[]): number {
        const closedUSs = userStories.filter(us => us.State === "Closed" && us.StateHistory);

        if (closedUSs.length === 0) return 0;

        const cycleTimes: number[] = [];

        closedUSs.forEach(us => {
            const history = us.StateHistory || [];

            // Find first "Active" or "In Progress" state
            const startState = history.find(h =>
                h.toState === "Active" || h.toState === "In Progress" || h.toState === "Committed"
            );

            // Find "Closed" state
            const endState = history.find(h => h.toState === "Closed");

            if (startState && endState) {
                const start = new Date(startState.changedDate);
                const end = new Date(endState.changedDate);
                const diffMs = end.getTime() - start.getTime();
                const diffDays = diffMs / (1000 * 60 * 60 * 24);
                cycleTimes.push(diffDays);
            }
        });

        if (cycleTimes.length === 0) return 0;

        const sum = cycleTimes.reduce((a, b) => a + b, 0);
        return sum / cycleTimes.length;
    }

    // ✅ NEW: Calculate Lead Time (Created → Closed)
    private calculateLeadTime(userStories: Task[]): number {
        const closedUSs = userStories.filter(us => us.State === "Closed");

        if (closedUSs.length === 0) return 0;

        const leadTimes: number[] = [];

        closedUSs.forEach(us => {
            const createdDate = new Date(us["Created Date"]);

            // Find "Closed" state in history
            const history = us.StateHistory || [];
            const closedState = history.find(h => h.toState === "Closed");

            if (closedState) {
                const closedDate = new Date(closedState.changedDate);
                const diffMs = closedDate.getTime() - createdDate.getTime();
                const diffDays = diffMs / (1000 * 60 * 60 * 24);
                leadTimes.push(diffDays);
            }
        });

        if (leadTimes.length === 0) return 0;

        const sum = leadTimes.reduce((a, b) => a + b, 0);
        return sum / leadTimes.length;
    }



    // --- Helper Methods (Migrated from report.ts) ---

    public returnAllTasksByWorkItemType(tasks: Task[], workItemType: string) {
        return tasks.filter((item) => item["Work Item Type"] === workItemType);
    }

    public returnUsersStories(tasks: Task[]) {
        return this.returnAllTasksByWorkItemType(tasks, "User Story");
    }

    public returnBugs(tasks: Task[]) {
        return this.returnAllTasksByWorkItemType(tasks, "Bug");
    }

    public returnTaskItens(tasks: Task[]) {
        return this.returnAllTasksByWorkItemType(tasks, "Task");
    }

    public returnDefects(tasks: Task[]) {
        return this.returnAllTasksByWorkItemType(tasks, "Defect");
    }

    public returnProblems(tasks: Task[]) {
        const problems_orbia = this.returnAllTasksByWorkItemType(tasks, "Orbia Problem");
        const problems = this.returnAllTasksByWorkItemType(tasks, "Problem");
        return problems.concat(problems_orbia);
    }

    public returnTasksCompleted(tasks: Task[]) {
        return tasks.filter((item) =>
            item.State === "Resolved" ||
            item.State === "Approved" ||
            item.State === "Closed" ||
            item.State === "Releasing" ||
            item.State === "In Production"
        );
    }

    public returnStates(tasks: Task[]) {
        const state = tasks.map((element) => element.State);
        return Array.from(new Set(state));
    }

    public returnArraySprintTasksStateCount(tasks: Task[]) {
        let state = this.returnStates(tasks);
        let count = state.map((element: any) => {
            let length = tasks.filter(function (item) {
                return item.State === element;
            }).length;
            return length;
        });
        return count;
    }

    public returnStateDate(item: Task[]) {
        const statusColors: any = {
            New: 'purple',
            UAT: 'orange',
            RC: 'green',
            QA: 'black',
            Releasing: 'brown',
            Active: 'blue',
            Resolved: 'yellow',
            Closed: 'red'
        };

        return this.returnStates(item).map((state, index) => ({
            label: state,
            value: this.returnArraySprintTasksStateCount(item)[index] || 0,
            color: statusColors[state] || 'gray'
        }));
    }

    public returnCompletedUsersStoriesLenght(tasks: Task[]) {
        const userStories = this.returnUsersStories(tasks);
        return userStories.filter((us: any) => us.State === "Closed").length;
    }

    public returnCompletedDefectsLenght(tasks: Task[]) {
        const defects = this.returnDefects(tasks);
        return defects.filter((def: any) => def.State === "Closed").length;
    }

    public returnCompletedBugs(tasks: Task[]) {
        const bugs = this.returnBugs(tasks);
        return bugs.filter((bug: any) => bug.State === "Closed").length;
    }

    public returnCompletedProblemsLenght(tasks: Task[]) {
        const problems = this.returnProblems(tasks);
        return problems.filter((problem: any) => problem.State === "Closed").length;
    }

    public returncompletedTasksItems(tasks: Task[]) {
        const taskItems = this.returnTaskItens(tasks);
        return taskItems.filter((task: any) => task.State === 'Closed').length;
    }

    public returntotalStoryPoints(userStories: Task[]) {
        return userStories.reduce((sum: number, story: any) => {
            const points = typeof story["Story Points"] === 'number' ? story["Story Points"] : 0;
            return sum + points;
        }, 0);
    }

    public returncompletedStoryPoints(userStories: Task[]) {
        return userStories
            .filter((story: any) => story.State === "Closed")
            .reduce((sum: number, story: any) => {
                const points = typeof story["Story Points"] === 'number' ? story["Story Points"] : 0;
                return sum + points;
            }, 0);
    }

    public returnTasksNotCompleted(tasks: Task[]) {
        return tasks.filter((item) =>
            item.State !== "Resolved" &&
            item.State !== "Approved" &&
            item.State !== "Closed" &&
            item.State !== "Releasing" &&
            item.State !== "In Production"
        );
    }

    public returnTasksPoints(tasks: Task[]) {
        return tasks.reduce((acc, task) => {
            const points = task["Story Points"] ? Number(task["Story Points"]) : 0;
            return acc + points;
        }, 0);
    }

    public returnTaskTitle(tasks: Task[]) {
        return tasks.map((item) => {
            let title = `${item.ID} - ${item.Title}`
            if (title.length < 40) return title;
            return `${title.slice(0, 40)}...`
        });
    }

    public returnCicleTimeByWorkItemType(tasks: Task[], workItemType: string) {
        let sprintTask = this.returnAllTasksByWorkItemType(tasks, workItemType);
        return sprintTask.map((item) => item["Cycle Time"]);
    }

    public returnTasksStoryPoint(tasks: Task[]) {
        return tasks.map((item) => item["Story Points"]);
    }

    public returnTaskID(tasks: Task[]) {
        return tasks.map((item) => item.ID);
    }

    public returnAllTasksByWorkItemTag(tasks: Task[], tag: string) {
        return tasks.filter((item: any) => {
            if (typeof item["Tags"] === "undefined") return false;
            return item["Tags"].split("; ").includes(tag);
        });
    }

    public returnTagsList(tags: string[], tasks: Task[]) {
        let itens: any[] = []
        tags.map((tag) => {
            let usList = this.returnAllTasksByWorkItemTag(tasks, tag).map((item) => {
                return item
            })

            if (usList.length > 0) {
                itens.push(usList)
            }
        })

        if (itens[0] !== undefined) {
            return itens[0]
        }

        return []
    }
}
