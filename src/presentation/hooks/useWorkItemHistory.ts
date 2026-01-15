import { useQuery } from "react-query";
import { GetWorkItemHistoryUseCase } from "../../core/application/use-cases/get-work-item-history.use-case";
import { AzureDevOpsWorkItemGateway } from "../../infrastructure/gateways/azure-devops-work-item.gateway";

const gateway = new AzureDevOpsWorkItemGateway();
const useCase = new GetWorkItemHistoryUseCase(gateway);

export function useWorkItemHistory(workItemId: string, title?: string) {
    return useQuery(
        ['workItemHistory', workItemId],
        () => useCase.execute(workItemId, title),
        {
            enabled: !!workItemId,
            staleTime: 1000 * 60 * 5, // 5 minutes cache
        }
    );
}
