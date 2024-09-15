import { useState } from 'react'
import { Box, Center, Flex, Grid, GridItem, Select, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import { tokenService } from '../../services/auth/tokenService';
import { setupAPIMetrics } from '../../services/api';

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
    const [plain, setPlain] =  useState()

    const returnSelectSuiteData = (id: string) => {
        let selectedSuite: any = suites.filter(function (suite: any) {
          return (
            suite.id == id
          );
        });
    
        return selectedSuite
      }

    const handleChange = async (event: any) => {
        setTestsCases([])
        setPlain(event.target.value)

        const selectedSuite = returnSelectSuiteData(event.target.value)

        if (selectedSuite !== undefined && selectedSuite.length > 0){
            setIsLoading(true)
            await axiosInstance
                .get(
                    `${selectedSuite[0]._links.testCases.href}`
                )
                .then((response) => {
                    if (response.status === 200) {
                        setTestsCases(response.data.value)
                    }
                })
            setIsLoading(false)
        }
    };

    return (
        <Grid templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={5} >
                <Flex direction="column" justify="center">
                    <Box display="flex" mt="1px" bg="white" p={3} gap="5" >
                        <Text mt="1">Suites</Text>
                        <VStack spacing="8">
                            <SimpleGrid
                                minChildWidth="240px"
                                spacing={["6", "8"]}
                                alignSelf="flex-start"
                            >
                                <VStack spacing={3}>
                                    <Select
                                        placeholder="Suites"
                                        borderRadius={6}
                                        size="sm"
                                        onChange={(ev: any) => handleChange(ev)}
                                        value={plain}
                                    >
                                        {suites.map((suite: any) => {
                                            return (
                                                <option key={suite.id} value={suite.id}>
                                                    {suite.name}
                                                </option>
                                            );
                                        })}
                                    </Select>
                                </VStack>
                            </SimpleGrid>
                        </VStack>
                    </Box>
                </Flex>
            </GridItem>
        </Grid>
    )
}
