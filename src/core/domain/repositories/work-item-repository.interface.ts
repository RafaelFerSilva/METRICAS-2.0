import { WorkItemUpdate } from "../entities/work-item-update.entity";

export interface IWorkItemRepository {
    getWorkItemUpdates(workItemId: string, title?: string): Promise<WorkItemUpdate[]>;
}
