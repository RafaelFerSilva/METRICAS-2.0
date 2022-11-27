import { createContext, ReactNode, useEffect, useState } from "react";
import { setupAPIMetrics } from "../services/api";
import { tokenService } from '../services/auth/tokenService';

interface Team {
  description: string;
  id: string;
  identityUrl: string;
  name: string;
  projectId: string;
  projectName: string;
  url: string;
}

interface TeamsProviderProps {
  children: ReactNode;
}

export const TeamsContext = createContext<Team[]>([]);
const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()
const axiosInstance = setupAPIMetrics({ organization, project_id, token });

export function TeamsProvider({ children }: TeamsProviderProps) {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let data: any;
      data = await axiosInstance
        .get(
          `https://dev.azure.com/${organization}/_apis/projects/${project_id}/teams?api-version=6.0`
        )
        .then((response) => {
          let teams: any;
          if (response.status === 200) {
            teams = response.data.value
          }
          return teams;
        }).catch(error => {
          console.warn(error.response)
        });
      setTeams(data)
    }

    fetchData()
  }, []);

  let sortTeam = teams.sort(function (a, b) {
    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
  });

  return (
    <TeamsContext.Provider value={sortTeam}>{children}</TeamsContext.Provider>
  );
}
