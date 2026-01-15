// Work Item Relation interface for hierarchical relationships
export interface WorkItemRelation {
    rel: string;
    url: string;
    attributes?: {
        name?: string;
        [key: string]: any;
    };
}

// State change history for Cycle Time / Lead Time calculations
export interface StateHistory {
    fromState: string | null;
    toState: string;
    changedDate: string;
}

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

    // ✅ Hierarchical relationship fields
    Parent?: string;
    Relations?: WorkItemRelation[];
    IsExternal?: boolean;

    // ✅ NEW: State history for precise Cycle/Lead Time
    StateHistory?: StateHistory[];
}
