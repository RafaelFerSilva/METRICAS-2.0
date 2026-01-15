import { ISprintRepository } from '../../core/domain/repositories/sprint-repository.interface';
import { Sprint, Task } from '../../core/domain/entities/sprint.entity';
import { getAxiosClient } from '../http/axios-client';
import { tokenService } from '../../services/auth/tokenService';
import NewTasks from '../../model/tasks';

export class AzureDevOpsSprintGateway implements ISprintRepository {
    private organization = tokenService.getOrganization();

    async getSprints(teamId: string, projectId: string): Promise<Sprint[]> {
        try {
            const response = await getAxiosClient().get(
                `https://dev.azure.com/${this.organization}/${projectId}/${teamId}/_apis/work/teamsettings/iterations?api-version=7.1`
            );

            if (response.status === 200 && response.data?.value) {
                return response.data.value.reverse().map((item: any) => this.mapToSprint(item));
            }
            return [];
        } catch (error) {
            console.error("Error fetching sprints:", error);
            throw error;
        }
    }

    async getSprintTasks(teamId: string, sprintId: string): Promise<Task[]> {
        const projectId = tokenService.getProjectId();
        try {
            // 1. Get Work Item Relations (IDs)
            const workItemsResponse = await getAxiosClient().get(
                `https://dev.azure.com/${this.organization}/${projectId}/${teamId}/_apis/work/teamsettings/iterations/${sprintId}/workitems?api-version=7.1-preview.1`
            );

            let workItemsIds: number[] = [];
            if (workItemsResponse.status === 200 && workItemsResponse.data.workItemRelations) {
                workItemsIds = workItemsResponse.data.workItemRelations.map((item: any) => item.target.id);
            }

            if (workItemsIds.length === 0) {
                return [];
            }

            // 2. Get Work Item Details (Batch)
            const workItemDetailsResponse = await getAxiosClient().get(
                `wit/workitems?ids=${workItemsIds.join(',')}&expand=all&api-version=7.1`
            );

            if (workItemDetailsResponse.status === 200) {
                const newTasks = new NewTasks();
                const tasks = newTasks.formatJson(workItemDetailsResponse.data.value);

                // 3. Fetch state history for all work items
                const tasksWithHistory = await Promise.all(
                    tasks.map(async (task) => {
                        const stateHistory = await this.getWorkItemHistory(task.ID);
                        return {
                            ...task,
                            StateHistory: stateHistory
                        };
                    })
                );

                return tasksWithHistory;
            }
            return [];

        } catch (error) {
            console.error("Error fetching sprint tasks:", error);
            throw error;
        }
    }

    // ✅ NEW: Get state change history for a work item
    private async getWorkItemHistory(workItemId: string): Promise<any[]> {
        try {
            const response = await getAxiosClient().get(
                `wit/workitems/${workItemId}/updates?api-version=7.1`
            );

            if (response.status === 200 && response.data?.value) {
                // Filter updates that have state changes
                const stateChanges = response.data.value
                    .filter((update: any) => update.fields && update.fields['System.State'])
                    .map((update: any) => ({
                        fromState: update.fields['System.State']?.oldValue || null,
                        toState: update.fields['System.State']?.newValue,
                        changedDate: update.fields['System.ChangedDate']?.newValue || update.revisedDate
                    }));

                return stateChanges;
            }
            return [];
        } catch (error) {
            console.error(`Error fetching history for work item ${workItemId}:`, error);
            return [];
        }
    }

    async getUserStoriesByIds(ids: string[]): Promise<Task[]> {
        if (ids.length === 0) {
            return [];
        }

        try {
            // Batch get work items by IDs
            const workItemDetailsResponse = await getAxiosClient().get(
                `wit/workitems?ids=${ids.join(',')}&expand=all&api-version=7.1`
            );

            if (workItemDetailsResponse.status === 200 && workItemDetailsResponse.data?.value) {
                const newTasks = new NewTasks();
                const tasks = newTasks.formatJson(workItemDetailsResponse.data.value);

                // Fetch state history for related USs and mark as external
                const tasksWithHistory = await Promise.all(
                    tasks.map(async (task) => {
                        const stateHistory = await this.getWorkItemHistory(task.ID);
                        return {
                            ...task,
                            IsExternal: true,
                            StateHistory: stateHistory
                        };
                    })
                );

                return tasksWithHistory;
            }
            return [];

        } catch (error) {
            console.error("Error fetching user stories by IDs:", error);
            throw error;
        }
    }

    private mapToSprint(raw: any): Sprint {
        return {
            id: raw.id,
            name: raw.name,
            path: raw.path,
            attributes: {
                startDate: raw.attributes?.startDate,
                finishDate: raw.attributes?.finishDate,
                timeFrame: raw.attributes?.timeFrame
            },
            url: raw.url
        };
    }
}
