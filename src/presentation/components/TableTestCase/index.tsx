

interface TableComponentProps {
  data: Record<string, any>[]; // Define os tipos corretamente
  headers: string[]; // As chaves que você deseja exibir na tabela
}

// Função para acessar e formatar valores
const getValue = (row: Record<string, any>, header: string) => {
  const value = row[header];

  if (value && typeof value === "object") {
    return JSON.stringify(value); // Serializa o objeto para string
  }

  return value !== null && value !== undefined ? value : "-"; // Retorna '-' se for null ou undefined
};

// Função para pegar o último item após o ponto no header
const getHeaderDisplayName = (header: string) => {
  if (header === "Custom.ec38de40-257b-4c45-9db9-284080382c3e") {
    return "AutomationStatus";
  }
  if (header === "Custom.e0ac16d1-5c7a-42f5-8111-be8b335c9e8e") {
    return "Origin";
  }

  const parts = header.split(".");
  return parts[parts.length - 1];
};

import { Box, Table, Thead, Tr, Th, Tbody, Td, Link as ChakraLink, Icon } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { tokenService } from "../../../services/auth/tokenService";
import { AzureFields } from "../../../core/config/azure-fields";

// ... (Keep existing helpers)

const TableTestCase: React.FC<TableComponentProps> = ({ data, headers }) => {
  const organization = tokenService.getOrganization();

  // Helper to construct URL
  const getWorkItemUrl = (id: string) => {
    // Fallback to Org level URL which redirects correctly
    return `https://dev.azure.com/${organization}/_workitems/edit/${id}`;
  };

  return (
    <Box mt="8" overflowX="auto">
      <Table variant="striped" colorScheme="twitter" size="sm">
        <Thead>
          <Tr>
            {headers.map((header, index) => (
              <Th key={index} textAlign="center" fontSize="xs" fontWeight="bold">
                {getHeaderDisplayName(header)}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {headers.map((header, headerIndex) => {
                const value = getValue(row, header);
                const isTitle = header === AzureFields.Title;
                const isId = header === AzureFields.Id;
                const id = row[AzureFields.Id] || row["System.Id"] || row["id"]; // Ensure we have ID for the link

                if (isTitle || isId) {
                  return (
                    <Td key={headerIndex} textAlign="center" fontSize="xs">
                      <ChakraLink href={getWorkItemUrl(id)} isExternal color="blue.600" fontWeight={isId ? "bold" : "normal"}>
                        {value} {isTitle && <Icon as={ExternalLinkIcon} mx="2px" />}
                      </ChakraLink>
                    </Td>
                  );
                }

                return (
                  <Td key={headerIndex} textAlign="center" fontSize="xs">
                    {header === AzureFields.AreaPath ? (
                      <Box whiteSpace="normal" wordBreak="break-word">
                        {value}
                      </Box>
                    ) : (
                      value
                    )}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TableTestCase;
