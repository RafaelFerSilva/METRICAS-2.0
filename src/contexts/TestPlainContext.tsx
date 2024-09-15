import { createContext, ReactNode, useEffect, useState } from "react";
import { setupAPIMetrics } from "../services/api";
import { tokenService } from '../services/auth/tokenService';

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()
const axiosInstance = setupAPIMetrics({ organization, project_id, token });

interface TestPlainProviderProps {
  children: ReactNode;
}

export const TestPlainContext = createContext<any[]>([]);

export function TestPlainProvider({ children }: TestPlainProviderProps) {
  const [testPlains, setTestPlains] = useState<any[]>([]);

  useEffect(() => {

    const fetchData = async () => {
      let data: any;
      data = await axiosInstance
        .get(
          `https://dev.azure.com/${organization}/${project_id}/_apis/testplan/plans?api-version=7.0`
        )
        .then((response) => {
          let testPlanItens: any[] = []
          if (response.status === 200) {
            response.data.value.map((plan: any) => {
              testPlanItens.push(plan)
            });

            return (testPlanItens)
          }
        })

      setTestPlains(data)
    }

    fetchData()


  }, []);

  return (
    <TestPlainContext.Provider value={testPlains}>{children}</TestPlainContext.Provider>
  );
}
