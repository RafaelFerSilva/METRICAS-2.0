import { useQuery } from 'react-query';
import { GetAllTestCasesUseCase } from '../../core/application/use-cases/get-all-test-cases.use-case';
import { AzureDevOpsTestGateway } from '../../infrastructure/gateways/azure-devops-test.gateway';

const testGateway = new AzureDevOpsTestGateway();
const getAllTestCasesUseCase = new GetAllTestCasesUseCase(testGateway);

export function useTestCases() {
    return useQuery(
        ['all-test-cases'],
        () => getAllTestCasesUseCase.execute(),
        {
            staleTime: 1000 * 60 * 10, // 10 minutes cache
            refetchOnWindowFocus: false,
        }
    );
}
