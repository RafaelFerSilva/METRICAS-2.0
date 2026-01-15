import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, HStack, Text, Icon } from "@chakra-ui/react";
import { MdWarning } from "react-icons/md";

interface InconsistencyAlertProps {
    storyPointsRate: number;
    usCompletionRate: number;
}

export function InconsistencyAlert({ storyPointsRate, usCompletionRate }: InconsistencyAlertProps) {
    // Check for inconsistency: Story Points at 100% but USs not
    const hasInconsistency = storyPointsRate >= 100 && usCompletionRate < 100;

    // Check for reverse inconsistency: USs at 100% but Story Points not
    const hasReverseInconsistency = usCompletionRate >= 100 && storyPointsRate < 100;

    if (!hasInconsistency && !hasReverseInconsistency) {
        return null;
    }

    return (
        <Alert status="warning" variant="left-accent" borderRadius="md">
            <AlertIcon />
            <Box>
                <AlertTitle fontSize="md">
                    <Icon as={MdWarning} mr={2} />
                    Inconsistência Detectada
                </AlertTitle>
                <AlertDescription fontSize="sm">
                    {hasInconsistency && (
                        <Text>
                            <strong>Story Points: 100%</strong> completos, mas <strong>User Stories: {usCompletionRate.toFixed(1)}%</strong>.
                            Isso indica que algumas User Stories sem story points ainda estão abertas.
                        </Text>
                    )}
                    {hasReverseInconsistency && (
                        <Text>
                            <strong>User Stories: 100%</strong> completas, mas <strong>Story Points: {storyPointsRate.toFixed(1)}%</strong>.
                            Verifique se há USs com story points estimados incorretamente.
                        </Text>
                    )}
                </AlertDescription>
            </Box>
        </Alert>
    );
}
