import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    VStack,
    HStack,
    Badge,
    Select,
    FormControl,
    FormLabel,
    useToast
} from '@chakra-ui/react';
import { AzureFields } from '../../../core/config/azure-fields';


import { useTestCases } from '../../contexts/AllTestPlainContext';
import { AzureDevOpsTestGateway } from '../../../infrastructure/gateways/azure-devops-test.gateway';
import { UpdateTestCaseUseCase } from '../../../core/application/use-cases/update-test-case.use-case';

const gateway = new AzureDevOpsTestGateway();
const updateUseCase = new UpdateTestCaseUseCase(gateway);

interface TestCaseDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    testCase: Record<string, any>;
    onUpdate: () => void; // Trigger refresh
}

const TestCaseDetailsModal: React.FC<TestCaseDetailsModalProps> = ({ isOpen, onClose, testCase, onUpdate }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [automationStatus, setAutomationStatus] = useState(
        testCase[AzureFields.AutomationStatus] || testCase[AzureFields.CustomAutomationStatus] || 'Not Automated'
    );

    const toast = useToast();
    const { updateLocalItem, refetch } = useTestCases();
    // We can also use refetch here directly if we wanted, but onUpdate is passed from parent.

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            const id = testCase[AzureFields.Id] || testCase['System.Id'] || testCase['id'];
            const updates = {
                [AzureFields.AutomationStatus]: automationStatus,
                // [AzureFields.CustomAutomationStatus]: automationStatus 
            };

            // 1. API Update
            await updateUseCase.execute(id, updates);

            // 2. Optimistic / Local Update (Fast UI feedback)
            updateLocalItem(String(id), updates);

            toast({
                title: "Test Case updated.",
                description: "Automation status has been updated successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // 3. Trigger background refresh (Eventual consistency)
            // onUpdate(); // passed prop
            refetch(); // Direct context usage for safety

            onClose();
        } catch (error) {
            toast({
                title: "Error updating Test Case.",
                description: "There was an error updating the status.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsUpdating(false);
        }
    };

    if (!testCase) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Test Case Details: {testCase[AzureFields.Id]}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack align="start" spacing={4}>
                        <Box>
                            <Text fontWeight="bold" fontSize="sm" color="gray.500">Title</Text>
                            <Text fontSize="lg">{testCase[AzureFields.Title]}</Text>
                        </Box>

                        <HStack spacing={8} w="full">
                            <Box>
                                <Text fontWeight="bold" fontSize="sm" color="gray.500">State</Text>
                                <Badge colorScheme={testCase[AzureFields.State] === 'Ready' ? 'green' : 'blue'}>
                                    {testCase[AzureFields.State]}
                                </Badge>
                            </Box>
                            <Box>
                                <Text fontWeight="bold" fontSize="sm" color="gray.500">Area Path</Text>
                                <Text>{testCase[AzureFields.AreaPath]}</Text>
                            </Box>
                        </HStack>

                        <FormControl>
                            <FormLabel>Automation Status</FormLabel>
                            <Select
                                value={automationStatus}
                                onChange={(e) => setAutomationStatus(e.target.value)}
                            >
                                <option value="Planned">Planned</option>
                                <option value="Automated">Automated</option>
                                <option value="Not Automated">Not Automated</option>
                            </Select>
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="blue" onClick={handleSave} isLoading={isUpdating}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

// Simple Box import missing above, correcting here
import { Box } from '@chakra-ui/react';

export default TestCaseDetailsModal;
