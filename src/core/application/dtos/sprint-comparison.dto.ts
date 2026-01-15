export interface SprintComparisonDTO {
    id: string;
    name: string;
    userStories: number;
    bugs: number;
    defects: number;
    problems: number;
    improvements: number;
    notExpected: number;
    points: number;
    pointsDelivery: number;
    pointsNotDelivered: number;
    avgCycleTime: number;
    avgLeadTime: number;

    //  Percentiles
    cycleTimeP95: number;
    leadTimeP95: number;

    // Control Limits (3 Sigma)
    cycleTimeUCL: number;
    cycleTimeLCL: number;
    leadTimeUCL: number;
    leadTimeLCL: number;
}
