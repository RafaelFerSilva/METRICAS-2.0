import { ITestRepository } from '../../core/domain/repositories/test-repository.interface';
import { TestCase } from '../../core/domain/entities/test-case.entity';
import { getAxiosClient } from '../http/axios-client';
import { tokenService } from '../../services/auth/tokenService';

export class AzureDevOpsTestGateway implements ITestRepository {
    async getAllTestCases(): Promise<TestCase[]> {
        const organization = tokenService.getOrganization();
        const project = tokenService.getProjectId();

        try {
            // 1. Dynamic Field Discovery
            const fieldsUrl = `https://dev.azure.com/${organization}/_apis/wit/fields?api-version=7.1-preview.3`;
            const fieldsResponse = await getAxiosClient().get(fieldsUrl);
            const allFields = fieldsResponse.data.value;

            // Filter for Custom fields + Standard fields we care about
            const customFields = allFields
                .filter((f: any) => f.referenceName.startsWith('Custom.'))
                .map((f: any) => f.referenceName);

            const standardFields = [
                "System.Id",
                "System.Title",
                "System.State",
                "System.AreaPath",
                "System.WorkItemType",
                "System.CreatedDate",
                "System.CreatedBy",
                "System.ChangedDate",
                "System.ChangedBy",
                "Microsoft.VSTS.Common.Priority",
                "Microsoft.VSTS.Common.Risk",
                "Microsoft.VSTS.TCM.AutomationStatus"
            ];

            const fieldsToFetch = [...standardFields, ...customFields].join(',');

            // 2. Initial WIQL Query (Get IDs) - Loop to handle > 20k items
            // Using $top in URL instead of WIQL TOP clause to avoid TF51006 error
            const BATCH_SIZE = 5000;
            const wiqlUrl = `https://dev.azure.com/${organization}/_apis/wit/wiql?api-version=7.1-preview.2&$top=${BATCH_SIZE}`;

            let allWorkItems: any[] = [];
            let lastId = 0;
            let fetchMore = true;

            while (fetchMore) {
                // Remove TOP from WIQL, rely on URL parameter
                const wiqlQuery = {
                    query: `SELECT [System.Id] FROM WorkItems WHERE [System.WorkItemType] = 'Test Case' AND [System.Id] > ${lastId} ORDER BY [System.Id] ASC`
                };

                const response = await getAxiosClient().post(wiqlUrl, wiqlQuery);
                const workItems = response.data.workItems;

                if (workItems && workItems.length > 0) {
                    allWorkItems = [...allWorkItems, ...workItems];
                    lastId = workItems[workItems.length - 1].id;

                    if (workItems.length < BATCH_SIZE) {
                        fetchMore = false;
                    }
                } else {
                    fetchMore = false;
                }
            }

            const workItems = allWorkItems;

            if (workItems.length > 0) {
                const allTestCases: TestCase[] = [];

                const chunkArray = (array: any[], size: number) => {
                    const result = [];
                    for (let i = 0; i < array.length; i += size) {
                        result.push(array.slice(i, size + i));
                    }
                    return result;
                };

                // Chunk IDs (200 is limit for Get Work Items Batch)
                const workItemChunks = chunkArray(workItems.map((item: any) => item.id), 200);

                for (const chunk of workItemChunks) {
                    // 3. Batch Fetch using POST to avoid URI length limits
                    const batchUrl = `https://dev.azure.com/${organization}/_apis/wit/workitemsbatch?api-version=7.1-preview.1`;

                    const batchBody = {
                        ids: chunk,
                        fields: fieldsToFetch.split(',')
                    };

                    const detailsResponse = await getAxiosClient().post(batchUrl, batchBody);
                    allTestCases.push(...detailsResponse.data.value);
                }

                return allTestCases;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching test cases:', error);
            return [];
        }
    }

    async updateTestCase(id: string, fields: Record<string, any>): Promise<void> {
        const organization = tokenService.getOrganization();
        const project = tokenService.getProjectId();

        const patchDocument = Object.keys(fields).map(key => ({
            op: "add",
            path: `/fields/${key}`,
            value: fields[key]
        }));

        // Using Org level URL for work item update is standard
        const updateUrl = `https://dev.azure.com/${organization}/_apis/wit/workitems/${id}?api-version=7.1-preview.3`;

        try {
            await getAxiosClient().patch(updateUrl, patchDocument, {
                headers: {
                    "Content-Type": "application/json-patch+json"
                }
            });
        } catch (error: any) {
            console.error(`Error updating test case ${id}:`, error);
            console.error(`Update URL: ${updateUrl}`);
            console.error(`Patch Document:`, JSON.stringify(patchDocument, null, 2));
            if (error.response) {
                console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
            }
            throw error;
        }
    }
}
