import React from "react";
import { Box, List, ListIcon, IconButton, Text, Flex, Avatar } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { MdAssessment, MdCompareArrows, MdReport, MdDashboard, MdSettings } from "react-icons/md";
import { useRouter } from "next/router";
import { ActiveLink } from "../ActiveLink";
import { useSidebarDrawer } from "../../contexts/SidebarDraweContext";

interface MenuItem {
  itemName: string;
  itemUrl: string;
  icon: any;
}

export default function HomeMenu() {
  const { isOpen, onOpen, onClose } = useSidebarDrawer();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { itemName: 'Dashboard', itemUrl: "/dashboard", icon: MdDashboard },
    { itemName: 'Sprint Report', itemUrl: "/sprintReport", icon: MdReport },
    { itemName: 'Comparison of Sprints', itemUrl: "/sprintCompare", icon: MdCompareArrows },
    { itemName: 'Runs Report', itemUrl: "/testsReport", icon: MdAssessment },
    { itemName: 'Tests Graphics', itemUrl: "/testsGraphics", icon: MdAssessment },
    { itemName: 'Tests Cases', itemUrl: "/alltestsCases", icon: MdAssessment }
  ];

  const isActiveRoute = (url: string) => {
    return router.asPath === url;
  };

  return (
    <>
      {/* Mobile menu button */}
      <Box 
        display={{ base: "block", lg: "none" }} 
        position="fixed" 
        top="4" 
        left="4" 
        zIndex="50"
      >
        <IconButton
          aria-label="Toggle Menu"
          onClick={isOpen ? onClose : onOpen}
          variant="outline"
          size="sm"
          bg="white"
          boxShadow="md"
          icon={isOpen ? <CloseIcon boxSize={3} /> : <HamburgerIcon boxSize={4} />}
        />
      </Box>

      {/* Overlay for mobile */}
      {isOpen && (
        <Box
          display={{ base: "block", lg: "none" }}
          position="fixed"
          inset="0"
          bg="blackAlpha.500"
          zIndex="40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <Box
        position="fixed"
        left="0"
        top="0"
        bottom="0"
        width="64"
        bg="white"
        boxShadow="lg"
        transform={{
          base: isOpen ? "translateX(0)" : "translateX(-100%)",
          lg: "translateX(0)"
        }}
        transition="transform 0.3s ease-in-out"
        zIndex="50"
        display="flex"
        flexDirection="column"
        height="100vh"
      >
        {/* Header */}
        <Flex
          align="center"
          justify="center"
          h="16"
          px="4"
          bg="blue.600"
          color="white"
        >
          <Box as={MdDashboard} boxSize="8" />
          <Text ml="2" fontSize="xl" fontWeight="bold">
            Dashboard
          </Text>
        </Flex>

        {/* User info */}
        <Box p="4" borderBottom="1px" borderColor="gray.200" bg="gray.50">
          <Flex align="center">
            <Avatar size="sm" bg="blue.100" color="blue.600" name="User" />
            <Box ml="3">
              <Text fontSize="sm" fontWeight="medium" color="gray.900">
                Usuário
              </Text>
              <Text fontSize="xs" color="gray.500">
                user@example.com
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Navigation */}
        <Box flex="1" px="2" py="4" overflowY="auto">
          <List spacing={1}>
            {menuItems.map((item: MenuItem) => {
              const isActive = isActiveRoute(item.itemUrl);
              return (
                <ActiveLink key={item.itemName} href={item.itemUrl} shouldMatchExactHref>
                  <Box
                    px="2"
                    py="2"
                    borderRadius="md"
                    bg={isActive ? "blue.100" : "transparent"}
                    color={isActive ? "blue.700" : "gray.600"}
                    _hover={{
                      bg: isActive ? "blue.100" : "gray.50",
                      color: isActive ? "blue.700" : "gray.900",
                      cursor: "pointer",
                    }}
                    display="flex"
                    alignItems="center"
                    fontSize="sm"
                    fontWeight="medium"
                    transition="all 0.2s"
                  >
                    <ListIcon 
                      as={item.icon} 
                      fontSize="20" 
                      color={isActive ? "blue.500" : "gray.400"}
                      mr="3"
                      flexShrink={0}
                    />
                    <Text>{item.itemName}</Text>
                  </Box>
                </ActiveLink>
              );
            })}
          </List>
        </Box>

        {/* Footer */}
        <Box p="4" borderTop="1px" borderColor="gray.200">
          <Flex
            align="center"
            px="2"
            py="2"
            borderRadius="md"
            color="gray.600"
            _hover={{ 
              bg: "gray.50",
              color: "gray.900",
              cursor: "pointer"
            }}
            fontSize="sm"
            fontWeight="medium"
          >
            <Box as={MdSettings} boxSize="5" mr="3" />
            <Text>Configurações</Text>
          </Flex>
        </Box>
      </Box>
    </>
  );
}