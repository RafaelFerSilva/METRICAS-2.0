import { useEffect, useState } from 'react';
import { Box, Flex, Input, VStack, List, ListItem } from "@chakra-ui/react";

interface AutoCompleteProps {
    options: any[]; // Array de opções (pode ser objetos ou strings)
    placeholder?: string; // Placeholder do input
    displayKey?: string; // Chave do objeto para exibir no dropdown (caso seja um array de objetos)
    size?: string;
    onSelect: (selectedItem: any) => void; // Callback para quando um item é selecionado
}

export default function AutoComplete({
    options,
    placeholder = "Search...",
    displayKey = "name",
    onSelect,
    size = "md"
}: AutoCompleteProps) {
    const [inputValue, setInputValue] = useState<string>(""); // Valor do input
    const [filteredOptions, setFilteredOptions] = useState<any[]>(options); // Opções filtradas
    const [showDropdown, setShowDropdown] = useState(false); // Controle de visibilidade da lista

    useEffect(() => {
        // Limpa o input quando as opções mudarem
        setInputValue(""); // Limpa o valor do input
        setFilteredOptions(options); // Reseta as opções filtradas para todas as novas opções
    }, [options]);

    useEffect(() => {
        // Filtra as opções conforme o texto digitado
        if (!inputValue || inputValue.trim() === "") {
            setFilteredOptions(options); // Mostra todas as opções se o input estiver vazio
        } else {
            const filtered = options.filter((option: any) =>
                typeof option === 'string'
                    ? option.toLowerCase().includes(inputValue.toLowerCase())
                    : option[displayKey].toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredOptions(filtered);
        }
    }, [inputValue, options, displayKey]);

    const handleSelect = (item: any) => {
        setInputValue(typeof item === 'string' ? item : item[displayKey]); // Define o valor no input
        onSelect(item); // Chama o callback de seleção com o item completo
        setShowDropdown(false); // Fecha o dropdown
    };

    return (
        <Flex direction="column">
            <Box>
                <VStack spacing={3}>
                    <Input
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => setShowDropdown(true)} // Mostra a lista ao focar no input
                        onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // Esconde a lista após um pequeno delay
                        size={size}
                    />
                    {showDropdown && (
                        <List bg="white" border="1px solid #ccc" borderRadius="6" maxH="200px" overflowY="auto" width="100%">
                            {filteredOptions.map((option, index) => (
                                <ListItem
                                    key={index}
                                    p="8px"
                                    cursor="pointer"
                                    _hover={{ bg: "gray.100" }}
                                    onMouseDown={() => handleSelect(option)} // Usa onMouseDown para evitar conflito com blur
                                >
                                    {typeof option === 'string' ? option : option[displayKey]} {/* Mostra o valor de displayKey */}
                                </ListItem>
                            ))}
                        </List>
                    )}
                </VStack>
            </Box>
        </Flex>
    );
}
