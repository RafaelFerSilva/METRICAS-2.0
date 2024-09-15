import { Flex, Heading, Table, Thead, Tr, Th, Tbody, Td, Box } from "@chakra-ui/react";
import { GenericTable } from "../GenericTable";

export default function TestCaseReport(testsCases: any) {

    const labels = ["ID", "Name", "State", "Automation Status", "Priority"];

    // Criando o array de arrays de strings dos work items
    const data: string[][] = testsCases.testsCases.map((item: any) => {
        if (item !== undefined && item.workItem) {
            // Transformando workItemFields em objeto para acessar pelas chaves
            const workItemFieldsObj = item.workItem.workItemFields.reduce((acc: any, field: any) => {
                return { ...acc, ...field };
            }, {});

            // Adicionando os campos id e name diretamente
            const element = {
                id: item.workItem.id || "",
                name: item.workItem.name || "",
                state: workItemFieldsObj["System.State"] || "",
                automationStatus: workItemFieldsObj["Microsoft.VSTS.TCM.AutomationStatus"] || "",
                priority: workItemFieldsObj["Microsoft.VSTS.Common.Priority"] || ""
            };

            // Convertendo o objeto element para um array de strings
            return Object.values(element);
        }
        return [];  // Retornar um array vazio para itens inválidos
    }).filter(row => row.length > 0);  // Remove arrays vazios

    return (
        <Box borderRadius={8} bg="GhostWhite" p="4" gap="4">
            <Flex mb="4" align="center">
                <Heading size="md" fontWeight="normal">
                    Test Case Report
                </Heading>
            </Flex>
            <Table colorScheme="twitter" size='sm'>
                <Thead>
                    <Tr>
                        {labels.map((label: any, key) => (
                            <Th key={key} textAlign="center">
                                {label}
                            </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((row: string[], rowIndex: number) => (
                        <Tr key={rowIndex}>
                            {row.map((cell: string, cellIndex: number) => (
                                <Td key={cellIndex} textAlign="center">
                                    {cell}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
}
