export interface Task {
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
