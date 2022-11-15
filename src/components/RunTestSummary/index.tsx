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
                <Box w='99%' p={5} borderWidth='1px' borderRadius='lg' m={2}>
                    {state == 'NotExecuted' && <Heading>Skipped Tests</Heading>}
                    {state == 'Failed' && <Heading>{state} Tests</Heading>}
                    {state == 'Passed' && <Heading>{state} Tests</Heading>}
                    {/* <Heading>{state} Tests</Heading> */}
                    <TableContainer >
                        <Table size='sm' variant='striped' colorScheme='teal' >
                            <Thead>
                                <Tr>
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
                                            <Td>{test.outcome}</Td>
                                            <Td>{test.automatedTestName}</Td>
                                            <Td>{suite[1]}</Td>
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