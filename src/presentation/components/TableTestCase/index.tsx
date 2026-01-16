import React, { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link as ChakraLink,
  Icon,
  Button
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { tokenService } from "../../../services/auth/tokenService";
import { AzureFields } from "../../../core/config/azure-fields";
import TestCaseDetailsModal from "../TestCaseDetailsModal/TestCaseDetailsModal";

interface TableComponentProps {
  data: Record<string, any>[];
  headers: string[];
  onRefresh?: () => void;
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

const TableTestCase: React.FC<TableComponentProps> = ({ data, headers, onRefresh }) => {
  const organization = tokenService.getOrganization();
  const [selectedTestCase, setSelectedTestCase] = useState<Record<string, any> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to construct URL
  const getWorkItemUrl = (id: string) => {
    // Fallback to Org level URL which redirects correctly
    return `https://dev.azure.com/${organization}/_workitems/edit/${id}`;
  };

  const handleOpenDetails = (row: Record<string, any>) => {
    setSelectedTestCase(row);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <>
      <Box mt="8" overflowX="auto">
        <Table variant="striped" colorScheme="twitter" size="sm">
          <Thead>
            <Tr>
              <Th textAlign="center" fontSize="xs" fontWeight="bold">Actions</Th>
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
                <Td textAlign="center">
                  <Button size="xs" onClick={() => handleOpenDetails(row)} colorScheme="blue" variant="outline">
                    Edit
                  </Button>
                </Td>
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

      {selectedTestCase && (
        <TestCaseDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          testCase={selectedTestCase}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default TableTestCase;
