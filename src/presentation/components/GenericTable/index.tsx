import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";

interface GenericTableProps {
  title: string;
  labels: any[];
  data: any[];
}

export function GenericTable({ title, labels, data }: GenericTableProps) {
  return (
    <>
      {data && (
        <Box borderRadius={8} bg="GhostWhite" p="4" gap="4">
          <Flex mb="4" align="center">
            <Heading size="md" fontWeight="normal">
              {title}
            </Heading>
          </Flex>
          <Table colorScheme="twitter" size='sm' >
            <Thead>
              <Tr>
                {labels.map((label: any, key) => {
                  return (
                    <Th key={key} textAlign="center">
                      {label}
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                {data.map((item: any, key) => {
                  return (
                    <Td key={key} textAlign="center">
                      {item}
                    </Td>
                  );
                })}
              </Tr>
            </Tbody>
          </Table>
        </Box>
      )}
    </>
  );
}
