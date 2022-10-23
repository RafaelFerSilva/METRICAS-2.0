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

export function TeamsProvider({ children }: TeamsProviderProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const token = tokenService.getToken()
  const project_id = tokenService.getProjectId()
  const organization = tokenService.getOrganization()

  useEffect(() => {
    const axiosInstance = setupAPIMetrics({organization, project_id ,token} );
    axiosInstance
      .get(
        `https://dev.azure.com/${organization}/_apis/projects/${project_id}/teams?api-version=6.0`
      )
      .then((response) => {
        if (response.status === 200) {
          setTeams(response.data.value)
        }
      }).catch(error => {
        console.warn(error.response)
    });
  }, [organization, project_id, token]);

  let sortTeam = teams.sort(function (a, b) {
    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
  });

  return (
    <TeamsContext.Provider value={sortTeam}>{children}</TeamsContext.Provider>
  );
}
