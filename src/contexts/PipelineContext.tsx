import { createContext, ReactNode, useEffect, useState } from "react";
import { setupAPIMetrics } from "../services/api";
import { tokenService } from '../services/auth/tokenService';

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()
const axiosInstance = setupAPIMetrics({ organization, project_id, token });

interface Pipeline {
  id: string;
  name: string;
  url: string;
}

interface PipelineProviderProps {
  children: ReactNode;
}

export const PipelineContext = createContext<Pipeline[]>([]);

export function PipelineProvider({ children }: PipelineProviderProps) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);

  useEffect(() => {

    const fetchData = async () => {
      let data: any;
      data = await axiosInstance
        .get(
          `https://dev.azure.com/${organization}/${project_id}/_apis/pipelines?api-version=6.0-preview.1`
        )
        .then((response) => {
          let pipelineItens: Pipeline[] = []
          if (response.status === 200) {
            response.data.value.map(({ id, name, url }: Pipeline) => {
              let pipe: Pipeline = {
                id,
                name,
                url,
              }
              pipelineItens.push(pipe)
            });

            return (pipelineItens)
          }
        })

      setPipelines(data)
    }

    fetchData()


  }, []);

  return (
    <PipelineContext.Provider value={pipelines}>{children}</PipelineContext.Provider>
  );
}
