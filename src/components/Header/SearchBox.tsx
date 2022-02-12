import { Flex, Icon, Input } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { setupAPIClient } from "../../services/api";

export function SearchBox() {
  const [search, setSearch ] = useState('');
  const [ results, setResults ] = useState([]);

  const apiClient = setupAPIClient();

  async function handleSearch(event: FormEvent) {

    if(!search.trim()){
      return;
    }

    // const response = await apiClient.get(`/products?q=${search}`)
    // setResults(response.data)
    
  }

  return (
    <Flex
      as="label"
      flex="1"
      py="4"
      px="8"
      ml="6"
      maxWidth={400}
      alignSelf="center"
      color="gray.200"
      position="relative"
      bg="gray.800"
      borderRadius="full"
    >
      <Input
        color="gray.50"
        variant="unstyled"
        px="4"
        mr="4"
        placeholder="Buscar Na Plataforma"
        _placeholder={{ color: "gray.400" }}
        onChange={e => setSearch(e.target.value)}
      />

      <Icon as={RiSearchLine} fontSize="20" />
    </Flex>
  );
}
