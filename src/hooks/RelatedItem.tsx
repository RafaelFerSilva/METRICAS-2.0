import { useEffect, useState } from "react";
import { setupAPIMetrics } from "../services/api";
import { tokenService } from "../services/auth/tokenService";

interface Task {
  ID: string;
  Title: string;
  "Work Item Type": string;
  State: string;
  "State Change Date": string;
  Area: string;
  "Iteration Path": string;
  "Activated By": string;
  "Activated Date": string;
  "Assigned To": string | undefined;
  "Changed By": string;
  "Changed Date": string;
  "Completed Work": string | undefined;
  "Created By": string;
  "Created Date": string;
  Description: string | undefined;
  Reason: string;
  "Story Points": number | undefined | string;
  "Cycle Time": number | undefined;
  "Sprint Start Date": string;
  Tags: string;
  Activity: string;
}


const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({organization, project_id ,token} );

export function RelatedItem(task: Task) {
  const [relateds, setRelatedItems] = useState<string[]>([]);

  useEffect(() => {
    let itens: string[] = [];

    axiosInstance
      .get(`wit/workItems/${task.ID}/updates?api-version=6.0`)
      .then((response) => {
        if (response.status === 200) {
          response.data.value.map((element: any) => {
            
            if (typeof element.relations !== "undefined") {
              if (typeof element.relations.added !== "undefined") {
                element.relations.added.map((added: any) => {
                  if (added.rel === "System.LinkTypes.Related") {
                    if (added.url !== null) {
                      itens.push(added.url.split("/").slice(-1)[0]);
                    }
                  }
                  return added;
                });
              }
            }
            
            return itens;
          });
        }
        setRelatedItems(itens)
      })
  }, [task]);

  return relateds;
}
