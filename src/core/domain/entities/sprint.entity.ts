export interface Sprint {
    id: string;
    name: string;
    path: string;
    attributes: {
        startDate: string;
        finishDate: string;
        timeFrame: string;
    };
    url: string;
}

// Re-exporting Task interface here or defining it. 
// Since we are moving to Core, we should separate from src/types, but for now passing 1:1.
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
    url?: string;
    Priority?: string;
    Severity?: string;
}
