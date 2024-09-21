// components/TableComponent.tsx
import { Box, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";

interface TableComponentProps {
  data: any[];
  headers: string[];
}

const TableComponent: React.FC<TableComponentProps> = ({ data, headers }) => {
  return (
    <Box mt="8">
      <Table colorScheme="twitter" size="sm">
        <Thead>
          <Tr>
            {headers.map((header, index) => (
              <Th key={index} textAlign="center">
                {header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {headers.map((header, headerIndex) => (
                <Td key={headerIndex} textAlign="center">
                  {row[header.toLowerCase()]}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TableComponent;