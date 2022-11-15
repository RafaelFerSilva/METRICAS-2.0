import { createContext, ReactNode, useEffect, useState } from "react";
import { setupAPIMetrics } from "../services/api";
import { tokenService } from '../services/auth/tokenService';

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()
const axiosInstance = setupAPIMetrics({ organization, project_id, token });

interface Run {
  id: string;
  name: string;
  url: string;
  finishedDate: string;
  createdDate: string;
  result: string;
  state: string;
  buildId: string
}


interface AllRunsProviderProps {
  children: ReactNode;
}

export const AllRunsContext = createContext<Run[]>([]);

export function AllRunsProvider({ children }: AllRunsProviderProps) {
  const [runs, setRuns] = useState<Run[]>([]);

  useEffect(() => {

    const fetchData = async () => {
      let data: any;
      data = await axiosInstance
        .get(
          `https://dev.azure.com/${organization}/${project_id}/_apis/test/runs?automated=true&includeRunDetails=true&api-version=6.0`
        )
        .then((response) => {
          let runsItens: Run[] = []
          if (response.status === 200) {
            response.data.value.map((runs: any) => {
              runsItens.push(runs)
            });

            return (runsItens)
          }
        }).catch(error => {
          console.warn(error.response)
        });

        setRuns(data)
    }

    fetchData()


  }, []);

  return (
    <AllRunsContext.Provider value={runs}>{children}</AllRunsContext.Provider>
  );
}
