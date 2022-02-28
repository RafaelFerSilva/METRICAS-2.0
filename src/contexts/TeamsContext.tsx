import { createContext, ReactNode, useEffect, useState } from "react";
import { setupAPIMetrics } from "../services/api";

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

let organization = process.env.ORGANIZATION;
export const TeamsContext = createContext<Team[]>([]);

export function TeamsProvider({ children }: TeamsProviderProps) {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const axiosInstance = setupAPIMetrics();
    axiosInstance
      .get(
        `https://dev.azure.com/${process.env.NEXT_PUBLIC_ORGANIZATION}/_apis/projects/${process.env.NEXT_PUBLIC_PROJECT}/teams?api-version=6.0`
      )
      .then((response) => setTeams(response.data.value));
  }, []);

  return (
    <TeamsContext.Provider value={teams}>{children}</TeamsContext.Provider>
  );
}
