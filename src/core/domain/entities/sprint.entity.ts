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

// Work Item Relation interface for hierarchical relationships
export interface WorkItemRelation {
    rel: string;  // e.g., "System.LinkTypes.Hierarchy-Reverse" (parent), "System.LinkTypes.Hierarchy-Forward" (child)
    url: string;
    attributes?: {
        name?: string;
        [key: string]: any;
    };
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

    // ✅ NEW: Hierarchical relationship fields
    Parent?: string;              // ID of parent work item (e.g., User Story ID for a Task)
    Relations?: WorkItemRelation[]; // All relations from API
    IsExternal?: boolean;         // Flag to mark if this item is from another sprint
}
