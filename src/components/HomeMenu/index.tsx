import React from "react";
import { Box, List, ListIcon, IconButton } from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { MdAssessment, MdCompareArrows, MdReport } from "react-icons/md";

interface MenuItem {
  itemName: string;
  itemUrl: string;
  icon: any;
}

interface PropsHomeMenu {
  setRenderComponent: (component: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function HomeMenu({ setRenderComponent, isOpen, setIsOpen }: PropsHomeMenu) {
  const menuItems: MenuItem[] = [
    { itemName: 'Sprint Report', itemUrl: "/sprintReport", icon: MdReport },
    { itemName: 'Comparison of Sprints', itemUrl: "/sprintCompare", icon: MdCompareArrows },
    { itemName: 'Runs Report', itemUrl: "/testsReport", icon: MdAssessment },
    { itemName: 'Tests Graphics', itemUrl: "/testsGraphics", icon: MdAssessment },
    { itemName: 'Tests Cases', itemUrl: "/alltestsCases", icon: MdAssessment }
  ];

  const handleMenuItem = (itemName: string) => {
    setRenderComponent(itemName);
  };

  return (
    <Box
      height="100%"
      width={isOpen ? "250px" : "50px"} // Largura fixa
      transition="width 0.3s ease"
      bg="gray.50"
      borderRight="1px solid"
      borderColor="gray.200"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box flex="1" overflowY="auto">
        <List spacing={3}>
          {menuItems.map((item: MenuItem) => (
            <Box
              key={item.itemName}
              p="3"
              bg="white"
              borderRadius="md"
              boxShadow={'0 2px 8px rgba(0, 0, 0, 0.1)'}
              _hover={{
                bg: 'gray.100',
                cursor: 'pointer',
              }}
              onClick={() => handleMenuItem(item.itemName)}
              display="flex"
              alignItems="center"
            >
              <ListIcon as={item.icon} fontSize="20" color='blue.500' />
              {isOpen && (
                <Box as="span" ml={2}>
                  {item.itemName}
                </Box>
              )}
            </Box>
          ))}
        </List>
      </Box>

      {/* Botão para abrir/fechar o menu à direita */}
      <Box p={4} display="flex" justifyContent="flex-end">
        <IconButton
          aria-label="Toggle Menu"
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost" // Remove a borda
          size="sm"
          colorScheme="blue"
          icon={isOpen ? <ArrowLeftIcon /> : <ArrowRightIcon />} // Ícones para abrir e fechar
        />
      </Box>
    </Box>
  );
}
