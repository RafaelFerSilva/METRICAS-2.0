import { IWorkItemRepository } from "../../core/domain/repositories/work-item-repository.interface";
import { WorkItemUpdate } from "../../core/domain/entities/work-item-update.entity";
import { getAxiosClient } from "../http/axios-client";

export class AzureDevOpsWorkItemGateway implements IWorkItemRepository {
    async getWorkItemUpdates(workItemId: string, title?: string): Promise<WorkItemUpdate[]> {
        const updates: WorkItemUpdate[] = [];
        try {
            const response = await getAxiosClient().get(`wit/workItems/${workItemId}/updates?api-version=7.1`);

            if (response.status === 200 && response.data.value) {
                response.data.value.forEach((element: any) => {
                    if (element.fields && element.fields["System.State"]) {
                        const update: WorkItemUpdate = {
                            workItemId: element.workItemId,
                            title: title || "", // Title usually comes from task context or could be in update? Using passed title.
                            revisedBy: element.revisedBy?.displayName || "Unknown",
                            reason: element.fields["System.Reason"]?.newValue || "",
                            state: element.fields["System.State"]?.newValue || "",
                            stateChangeDate: element.fields["Microsoft.VSTS.Common.StateChangeDate"]?.newValue
                                ? element.fields["Microsoft.VSTS.Common.StateChangeDate"].newValue.split("T", 1).toString()
                                : ""
                        };
                        updates.push(update);
                    }
                });
            }
        } catch (error) {
            console.error(`Error fetching updates for work item ${workItemId}:`, error);
            // Optionally throw or return empty
        }
        return updates;
    }
}
