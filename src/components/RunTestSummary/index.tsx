import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableContainer,
    Box,
    Heading,
    Divider,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';

interface RunTestItens {
    id: string;
    automatedTestName: string;
    automatedTestStorage: string;
    build: string;
    startedDate: string;
    completedDate: string;
    createdDate: string;
    durationInMs: string;
    outcome: string;
    priority: string;
    state: string;
    testCaseReferenceId: string;
    testRun: string;
}

interface RunTestProps {
    runTests: RunTestItens[];
    state?: string;
}

export default function RunTestSymmary({ runTests, state }: RunTestProps) {
    let stateCountTests = runTests.filter(test => test.outcome == state)

    return (
        <>
            {stateCountTests.length > 0 && (
                <Box w='100%' p={2} borderWidth='1px' borderRadius='lg' m={1} >
                    {state == 'NotExecuted' && <><Heading fontSize={"sm"}>Skipped Tests</Heading><Divider /></>}
                    {state == 'Failed' && <><Heading fontSize={"sm"}>{state} Tests</Heading><Divider /></>}
                    {state == 'Passed' && <><Heading fontSize={"sm"}>{state} Tests</Heading><Divider /></>}
                    <TableContainer  >
                        <Table size='sm' variant='striped' colorScheme='teal' >
                            <Thead>
                                <Tr >
                                    <Th>STATUS</Th>
                                    <Th>NAME</Th>
                                    <Th>SUITE</Th>
                                </Tr>
                            </Thead>
                            <Tbody >
                                {runTests.filter(test => test.outcome == state).map((test: RunTestItens) => {
                                    let suite = test.automatedTestStorage.split(".")
                                    return (
                                        <Tr key={test.id}>
                                            <Td fontSize="xs">{test.outcome}</Td>
                                            <Td fontSize="xs">{test.automatedTestName}</Td>
                                            <Td fontSize="xs">{suite[1]}</Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                            <Tfoot>
                                <Tr>
                                    <Th>STATUS</Th>
                                    <Th>NAME</Th>
                                    <Th>SUITE</Th>
                                </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </>
    )
}
