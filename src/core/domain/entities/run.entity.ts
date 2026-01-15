export interface Run {
    id: string;
    name: string;
    url: string;
    finishedDate: string;
    createdDate: string;
    result: string;
    state: string;
    buildId: string;
    totalTests?: number;
    passedTests?: number;
    incompleteTests?: number;
    unanalyzedTests?: number;
    notApplicableTests?: number;
}

export interface RunDetails extends Run {
    pipelineId: string;
    totalTests: number;
    passedTests: number;
    incompleteTests: number;
    unanalyzedTests: number;
    notApplicableTests: number;
    postProcessState: string;
}

export interface RunTestResult {
    id: number;
    automatedTestName: string;
    automatedTestStorage: string;
    buildId: string;
    startedDate: string;
    completedDate: string;
    createdDate: string;
    durationInMs: number;
    outcome: string;
    priority: number;
    state: string;
    testCaseReferenceId: number;
    testRunId: string;
    errorMessage: string;
}
