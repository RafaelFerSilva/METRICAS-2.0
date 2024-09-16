import { useEffect, useState } from 'react'
import { Box, Center, Flex, Grid, GridItem, Select, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import { tokenService } from '../../services/auth/tokenService';
import { setupAPIMetrics } from '../../services/api';
import { useToast } from '@chakra-ui/react'
import AutoComplete from '../AutoComplete';

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

interface SelectSuiteProps {
    suites: any[]
    setTestsCases: (testCases: any) => void;
    setIsLoading?: (isLoading: boolean) => void;
}

export default function TestSuiteSelect({ setTestsCases, suites, setIsLoading }: SelectSuiteProps) {
    const toast = useToast()

    const returnSelectSuiteData = (id: string) => {
        let selectedSuite: any = suites.filter(function (suite: any) {
            return (
                suite.id == id
            );
        });

        return selectedSuite
    }

    const handleChange = async (selectedItem: any) => {
        setTestsCases([])

        const id = selectedItem.id;
        if (id && String(id).trim() !== "") {
            setIsLoading(true);

            const selectedSuite = returnSelectSuiteData(id)

            if (selectedSuite !== undefined && selectedSuite.length > 0) {
                try {
                    await axiosInstance
                        .get(
                            `${selectedSuite[0]._links.testCases.href}`
                        )
                        .then((response) => {
                            if (response.status === 200) {
                                if (response.data.value.length > 0) {
                                    setTestsCases(response.data.value)
                                } else {
                                    toast({
                                        title: `Esta suite não tem nenhum test case!!!!`,
                                        status: 'warning',
                                        position: 'top-right',
                                        isClosable: true,
                                    })
                                }
                            }
                        })

                } catch (error) {
                    console.error("Error fetching data:", error);
                    toast({
                        title: `Error fetching data: ${error}`,
                        status: 'warning',
                        position: 'top-right',
                        isClosable: true,
                    })
                } finally {
                    setIsLoading(false)
                }
            }
        }
    };

    return (
        <Grid templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={5}>
                <Flex direction="column" justify="center">
                    <Box display="flex" mt="1px" bg="white" p="3" gap="5">
                        <Text mt="1">Test Suites</Text>
                        <VStack spacing="8">
                            <AutoComplete
                                options={suites} 
                                displayKey="name" 
                                placeholder="Search Suites"
                                onSelect={handleChange} 
                            />
                        </VStack>
                    </Box>
                </Flex>
            </GridItem>
        </Grid>
    )
}
