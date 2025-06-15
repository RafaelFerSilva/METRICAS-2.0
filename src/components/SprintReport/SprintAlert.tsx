import { VStack, Alert, AlertIcon, AlertTitle, AlertDescription, Box } from "@chakra-ui/react";

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

interface SprintAlertProps {
    bugs: Task[];
    defects: Task[];
    totalStoryPoints: number;
    completedStoryPoints: number;
}

export default function SprintAlert({bugs, defects, totalStoryPoints, completedStoryPoints}: SprintAlertProps) {
    return (
        <VStack spacing={4} align="stretch">
          {bugs.filter(bug => bug.State !== "Closed").length > 0 && (
            <Alert status="error" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Atenção aos Bugs!</AlertTitle>
                <AlertDescription>
                  Existem {bugs.filter(bug => bug.State !== "Closed").length} bugs em aberto que precisam de atenção.
                </AlertDescription>
              </Box>
            </Alert>
          )}

          {defects.filter(defect => defect.State !== "Closed").length > 0 && (
            <Alert status="warning" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Atenção aos Defeitos!</AlertTitle>
                <AlertDescription>
                  Existem {defects.filter(defect => defect.State !== "Closed").length} defects em aberto que precisam de atenção.
                </AlertDescription>
              </Box>
            </Alert>
          )}

          {totalStoryPoints > 0 && completedStoryPoints / totalStoryPoints < 0.5 && (
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Progresso dos Story Points</AlertTitle>
                <AlertDescription>
                  Apenas {Math.round((completedStoryPoints / totalStoryPoints) * 100)}% dos story points foram concluídos.
                  Considere revisar o escopo do sprint.
                </AlertDescription>
              </Box>
            </Alert>
          )}
        </VStack>
    )
}