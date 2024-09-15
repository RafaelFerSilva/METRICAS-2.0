import { useContext, useEffect, useState } from 'react'
import { Box, Center, Flex, Grid, GridItem, Select, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import { tokenService } from '../../services/auth/tokenService';
import { setupAPIMetrics } from '../../services/api';
import { TestPlainContext } from '../../contexts/TestPlainContext';

const token = tokenService.getToken()
const project_id = tokenService.getProjectId()
const organization = tokenService.getOrganization()

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

interface SelectPlainProps {
    setSuites: (suites: any) => void;
  }

export default function TestPlanSelect({ setSuites }: SelectPlainProps) {
    const [plain, setPlain] =  useState()
    const testPlains = useContext(TestPlainContext);

    const handleChange = async (event: any) => {
        setSuites([])
        setPlain(event.target.value)

        await axiosInstance
            .get(
                `https://dev.azure.com/${organization}/${project_id}/_apis/testplan/Plans/${event.target.value}/suites?api-version=7.1-preview.1`
            )
            .then((response) => {
                if (response.status === 200) {
                    setSuites(response.data.value)
                }
            })
    };

    return (
        <Grid templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={5} >
                <Flex direction="column" justify="center">
                    <Box display="flex" mt="1px" bg="white" p={3} gap="5" >
                        <Text mt="1">Test Plains</Text>
                        <VStack spacing="8">
                            <SimpleGrid
                                minChildWidth="240px"
                                spacing={["6", "8"]}
                                alignSelf="flex-start"
                            >
                                <VStack spacing={3}>
                                    <Select
                                        placeholder="Test Plains"
                                        borderRadius={6}
                                        size="sm"
                                        onChange={(ev: any) => handleChange(ev)}
                                        value={plain}
                                    >
                                        {testPlains.map((plain: any) => {
                                            return (
                                                <option key={plain.id} value={plain.id}>
                                                    {plain.name}
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
