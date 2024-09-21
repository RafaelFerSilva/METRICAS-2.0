import { Box, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";

interface TableComponentProps {
  data: Record<string, any>[]; // Define os tipos corretamente
  headers: string[]; // As chaves que você deseja exibir na tabela
}

// Função para acessar e formatar valores
const getValue = (row: Record<string, any>, header: string) => {
  // Acessa a propriedade dentro do objeto usando o header completo
  const value = row[header];

  // Verifica se o valor é um objeto e não renderiza diretamente
  if (value && typeof value === "object") {
    return JSON.stringify(value); // Serializa o objeto para string
  }

  return value !== null && value !== undefined ? value : "-"; // Retorna '-' se for null ou undefined
};

// Função para pegar o último item após o ponto no header
const getHeaderDisplayName = (header: string) => {
  // Verifica se o header é um dos customizados e retorna o nome correto
  if (header === "Custom.ec38de40-257b-4c45-9db9-284080382c3e") {
    return "AutomationStatus";
  }
  if (header === "Custom.e0ac16d1-5c7a-42f5-8111-be8b335c9e8e") {
    return "Origin";
  }
  
  // Caso contrário, retorna o último item após o ponto
  const parts = header.split(".");
  return parts[parts.length - 1]; // Retorna o último item do array, ou seja, o nome simples
};
const TableTestCase: React.FC<TableComponentProps> = ({ data, headers }) => {
  return (
    <Box mt="8">
      <Table colorScheme="twitter" size="sm">
        <Thead>
          <Tr>
            {headers.map((header, index) => (
              <Th key={index} textAlign="center">
                {getHeaderDisplayName(header)} {/* Exibe apenas o último item do header */}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {headers.map((header, headerIndex) => (
                <Td key={headerIndex} textAlign="center">
                  {getValue(row, header)} {/* Acessa o valor utilizando o header completo */}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TableTestCase;
