import { useContext, useState } from 'react';
import { Box, Flex, Grid, GridItem, VStack, Text } from "@chakra-ui/react";
import { tokenService } from '../../../services/auth/tokenService';
import { setupAPIMetrics } from '../../../services/api';
import { TestPlainContext } from '../../contexts/TestPlainContext';
import AutoComplete from '../AutoComplete'; 

const token = tokenService.getToken();
const project_id = tokenService.getProjectId();
const organization = tokenService.getOrganization();

const axiosInstance = setupAPIMetrics({ organization, project_id, token });

interface SelectPlainProps {
    setSuites: (suites: any) => void;
    setTestsCases: (testsCases: any) => void;
}

export default function TestPlanSelect({ setSuites, setTestsCases }: SelectPlainProps) {
    const testPlains = useContext(TestPlainContext);

    const handleSelect = async (selectedItem: any) => {
        setSuites([]);
        setTestsCases([]);
    
        const id = selectedItem.id;
    
        if (id && String(id).trim() !== "") {
            try {
                const response = await axiosInstance.get(
                    `/testplan/Plans/${id}/suites?api-version=7.1-preview.1`
                );
                if (response.status === 200) {
                    setSuites(response.data.value);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };

    return (
        <Grid templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={5}>
                <Flex direction="column" justify="center">
                    <Box display="flex" mt="1px" bg="white" p="3" gap="5">
                        <Text mt="1">Test Plains</Text>
                        <VStack spacing="8">
                            <AutoComplete
                                options={testPlains} // Passa as opções (os testPlains)
                                displayKey="name" // A chave a ser exibida
                                placeholder="Search Test Plains" // Placeholder do input
                                onSelect={handleSelect} // Função chamada quando um item é selecionado
                            />
                        </VStack>
                    </Box>
                </Flex>
            </GridItem>
        </Grid>
    );
}
