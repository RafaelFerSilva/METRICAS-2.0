export const AzureFields = {
    // Standard Fields
    Id: "System.Id",
    Title: "System.Title",
    State: "System.State",
    AreaPath: "System.AreaPath",
    WorkItemType: "System.WorkItemType",
    Priority: "Microsoft.VSTS.Common.Priority",
    Risk: "Microsoft.VSTS.Common.Risk",
    AutomationStatus: "Microsoft.VSTS.TCM.AutomationStatus", // Standard

    // Custom Fields (To be replaced by dynamic discovery or environment vars in future)
    // Current hardcoded values moved here for manageability
    CustomAutomationStatus: "Custom.ec38de40-257b-4c45-9db9-284080382c3e",
    CustomPlatform: "Custom.Plataforma",
    CustomOrigin: "Custom.e0ac16d1-5c7a-42f5-8111-be8b335c9e8e",
    CustomSmokeTest: "Custom.SmokeTest",
};

export const KPI_VALUES = {
    Automated: ["Automated", "Automatizado"],
    Smoke: ["Yes", "True", "Sim", "S"],
    HighRisk: ["1 - High", "1 - Crítico", "High"],
};
