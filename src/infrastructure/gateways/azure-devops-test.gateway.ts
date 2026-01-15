import { ITestRepository } from '../../core/domain/repositories/test-repository.interface';
import { TestCase } from '../../core/domain/entities/test-case.entity';
import { getAxiosClient } from '../http/axios-client';
import { tokenService } from '../../services/auth/tokenService';

export class AzureDevOpsTestGateway implements ITestRepository {
    async getAllTestCases(): Promise<TestCase[]> {
        const organization = tokenService.getOrganization();
        const url = `https://dev.azure.com/${organization}/_apis/wit/wiql?api-version=7.1-preview.2`;

        const query = {
            query: `
        SELECT [System.Id], 
               [System.Title], 
               [System.State] 
        FROM WorkItems 
        WHERE [System.WorkItemType] = 'Test Case' 
          AND [System.AreaPath] != 'Engineering\\Qualidade'
          AND [Custom.ec38de40-257b-4c45-9db9-284080382c3e] != 'Não passível de automação'
      `
        };

        try {
            const response = await getAxiosClient().post(url, query);
            const workItems = response.data.workItems;

            if (workItems.length > 0) {
                const allTestCases: TestCase[] = [];

                const chunkArray = (array: any[], size: number) => {
                    const result = [];
                    for (let i = 0; i < array.length; i += size) {
                        result.push(array.slice(i, size + i));
                    }
                    return result;
                };

                const workItemChunks = chunkArray(workItems.map((item: any) => item.id), 200);

                for (const chunk of workItemChunks) {
                    const ids = chunk.join(',');
                    const detailsUrl = `/wit/workitems?ids=${ids}&api-version=7.1-preview.3`;

                    const detailsResponse = await getAxiosClient().get(detailsUrl);
                    allTestCases.push(...detailsResponse.data.value);
                }

                return allTestCases;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching test cases:', error);
            return []; // Return empty on error as per original logic, though throwing might be better
        }
    }
}
