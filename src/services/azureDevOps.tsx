import axios from 'axios';
import { setupAPIMetrics } from './api';
import { tokenService } from './auth/tokenService';
const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()
const axiosInstance = setupAPIMetrics({ organization, project_id, token });

export const fetchTestPlans = async () => {
  const url = `https://dev.azure.com/${organization}/${project_id}/_apis/testplan/plans?api-version=7.0`;

  try {
    const response = await axiosInstance.get(url);
    return response.data.value;
  } catch (error) {
    console.error('Error fetching test plans:', error);
    throw error;
  }
};

export const fetchTestSuites = async (planId: number) => {
    const url = `https://dev.azure.com/${organization}/${project_id}/_apis/testplan/Plans/${planId}/suites?api-version=7.1-preview.1`;
  
    try {
      const response = await axiosInstance.get(url);
      return response.data.value;
    } catch (error) {
      console.error('Error fetching test suites:', error);
      throw error;
    }
  };

  export const fetchTestCasesFromSuite = async (suite: any) => {
    try {
      const response = await axiosInstance.get(suite._links.testCases.href);
      if(response.data.value.length > 0 || response.data.value.length !== undefined) {
        return response.data.value;
      }
      
    } catch (error) {
      console.error(`Error fetching test cases from suite ${suite.id}:`, error);
      // Continue to the next request by returning an empty array or null
      return [];
    }
  };
  

  export const fetchAllTestCases = async () => {
    try {
      // 1. Obtenha todos os planos de teste
      const testPlans = await fetchTestPlans();
  
      const allTestCases = [];
      const allTestSuites = []
  
      // 2. Para cada plano, obtenha todas as suítes
      for (const plan of testPlans) {
        const testSuites = await fetchTestSuites(plan.id);
        allTestSuites.push(...testSuites)
      }

      // 3. Para cada suíte, obtenha todos os test cases
      for (const suite of allTestSuites) {
        const testCases = await fetchTestCasesFromSuite(suite);
        allTestCases.push(...testCases);
      }
      return allTestCases;
    } catch (error) {
      console.error('Error fetching all test cases:', error);
      throw error;
    }
  };
  
  export const fetchAllTestCasesWiql = async () => {
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
      const response = await axiosInstance.post(url, query);
      const workItems = response.data.workItems;
  
      if (workItems.length > 0) {
        const allTestCases = [];
  
        // Função auxiliar para dividir os IDs em grupos de até 200
        const chunkArray = (array, size) => {
          const result = [];
          for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, size + i));
          }
          return result;
        };
  
        // Dividir os IDs dos work items em grupos de 200
        const workItemChunks = chunkArray(workItems.map(item => item.id), 200);
  
        // Fazer requisição para cada grupo e juntar os resultados
        for (const chunk of workItemChunks) {
          const ids = chunk.join(',');
          const detailsUrl = `https://dev.azure.com/${organization}/${project_id}/_apis/wit/workitems?ids=${ids}&api-version=7.1-preview.3`;
  
          const detailsResponse = await axiosInstance.get(detailsUrl);
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
  };
  
  