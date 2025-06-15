
import { Table, Thead, Tr, Th, Tbody, Td, Heading, Box, IconButton, Icon } from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";

interface TableComponentProps {
  data: Record<string, any>[];
  headers: string[];
  tableTitle?: string;
  tableTitleSize?: string;
  tableColorScheme?: string;
  tableSize?: string;
  tableVariant?: string;
  headerFontSize?: string;
  headerFontWeight?: string;
  tableItemFontSize?: string;
  url?: string;
}

const getValue = (row: Record<string, any>, header: string) => {
  const value = row[header];

  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  return value !== null && value !== undefined ? value : "-";
};

export default function TableComponent({
  data,
  headers,
  tableTitle = "",
  tableTitleSize = "md",
  tableColorScheme = "twitter",
  tableSize = "sm",
  tableVariant = "striped",
  headerFontSize = "small",
  headerFontWeight = "bold",
  tableItemFontSize = "x-small",
  url = "link",
}: TableComponentProps) {

  const renderContent = () => {
    return data.length > 0 ? (
      <Box>
        <Heading size={tableTitleSize} marginBottom="3">{tableTitle}</Heading>
        <Table colorScheme={tableColorScheme} size={tableSize} variant={tableVariant}>
          <Thead>
            <Tr>
              {headers.map((header, index) => (
                <Th key={index} textAlign="left" fontSize={headerFontSize} fontWeight={headerFontWeight}>
                  {header}
                </Th>
              ))}
              <Th key="link" textAlign="left" fontSize={headerFontSize} fontWeight={headerFontWeight}>
                Link
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {headers.map((header, headerIndex) => (
                  <Td key={headerIndex} textAlign="left" fontSize={tableItemFontSize}>
                    {getValue(row,header)}
                  </Td>
                ))}
                <Td textAlign="left" fontSize={tableItemFontSize}>
                  <IconButton
                    aria-label="Open Link"
                    icon={<Icon as={FaExternalLinkAlt} />}
                    onClick={() => window.open(getValue(row,'url'), "_blank")}
                    size="sm"
                    variant="ghost"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    ) : null;
  }

  return renderContent();
}