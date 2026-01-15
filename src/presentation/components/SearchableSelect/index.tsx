import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  List,
  ListItem,
  Text,
  Icon,
  Flex,
  useDisclosure,
  useOutsideClick,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from '@chakra-ui/icons';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function SearchableSelect({
  options,
  placeholder = "Selecione uma opção",
  value,
  onChange,
  isDisabled = false,
  size = 'md'
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: ref,
    handler: onClose,
  });

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (value) {
      const selectedOption = options.find(option => option.value === value);
      setDisplayValue(selectedOption?.label || '');
    } else {
      setDisplayValue('');
    }
  }, [value, options]);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setDisplayValue(option.label);
    setSearchTerm('');
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) onOpen();
  };

  const handleInputClick = () => {
    if (!isDisabled) {
      onOpen();
      setSearchTerm('');
    }
  };

  const inputHeight = {
    sm: '32px',
    md: '40px',
    lg: '48px'
  };

  return (
    <Box position="relative" ref={ref} w="100%">
      <InputGroup size={size}>
        <Input
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          isDisabled={isDisabled}
          bg="white"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          _hover={{
            borderColor: "gray.400"
          }}
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px #3182ce"
          }}
          _disabled={{
            bg: "gray.100",
            cursor: "not-allowed"
          }}
          cursor={isDisabled ? "not-allowed" : "pointer"}
          readOnly={!isOpen}
        />
        <InputRightElement height={inputHeight[size]}>
          <IconButton
            aria-label="Toggle dropdown"
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            size="sm"
            variant="ghost"
            onClick={isDisabled ? undefined : (isOpen ? onClose : onOpen)}
            isDisabled={isDisabled}
          />
        </InputRightElement>
      </InputGroup>

      {isOpen && !isDisabled && (
        <Box
          position="fixed"
          top={`${ref.current?.getBoundingClientRect().bottom || 0}px`}
          left={`${ref.current?.getBoundingClientRect().left || 0}px`}
          width={`${ref.current?.getBoundingClientRect().width || 0}px`}
          zIndex={9999}
          bg="white"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          boxShadow="xl"
          maxHeight="200px"
          overflowY="auto"
          mt={1}
        >
          {filteredOptions.length > 0 ? (
            <List>
              {filteredOptions.map((option) => (
                <ListItem
                  key={option.value}
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{
                    bg: "blue.50",
                    color: "blue.600"
                  }}
                  _focus={{
                    bg: "blue.100",
                    color: "blue.700"
                  }}
                  onClick={() => handleSelect(option)}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  _last={{
                    borderBottom: "none"
                  }}
                >
                  <Text fontSize={size}>{option.label}</Text>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box px={3} py={4} textAlign="center">
              <Flex align="center" justify="center" color="gray.500">
                <Icon as={SearchIcon} mr={2} />
                <Text fontSize="sm">Nenhum resultado encontrado</Text>
              </Flex>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}