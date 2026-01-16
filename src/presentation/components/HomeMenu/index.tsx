import React from "react";
import { Box, List, ListIcon, IconButton, Text, Flex, Avatar, Tooltip } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { MdAssessment, MdReport, MdDashboard, MdSettings, MdTrendingUp } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { ActiveLink } from "../ActiveLink";
import { useSidebarDrawer } from "../../contexts/SidebarDraweContext";
import { useAuth } from "../../hooks/useAuth";

interface MenuItem {
  itemName: string;
  itemUrl: string;
  icon: any;
}

export default function HomeMenu() {
  const { isOpen, onOpen, onClose, isCollapsed, toggleCollapse } = useSidebarDrawer();
  const router = useRouter();
  const { logout } = useAuth();

  const menuItems: MenuItem[] = [
    { itemName: 'Dashboard', itemUrl: "/dashboard", icon: MdDashboard },
    { itemName: 'Sprint Report', itemUrl: "/sprintReport", icon: MdReport },
    { itemName: 'Sprint Trends', itemUrl: "/sprintTrends", icon: MdTrendingUp },
    { itemName: 'Tests Cases', itemUrl: "/alltestsCases", icon: MdAssessment },
  ];

  const isActiveRoute = (url: string) => {
    return router.asPath === url;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile menu button */}
      <Box
        display={{ base: "block", lg: "none" }}
        position="static"
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
        width={isCollapsed ? "20" : "64"}
        bg="white"
        boxShadow="2xl"
        transform={{
          base: isOpen ? "translateX(0)" : "translateX(-100%)",
          lg: "translateX(0)"
        }}
        transition="all 0.3s ease-in-out"
        zIndex="50"
        display="flex"
        flexDirection="column"
        height="100vh"
        borderRight="1px solid"
        borderColor="gray.100"
      >
        {/* Toggle Button for Desktop */}
        <Flex justify={isCollapsed ? "center" : "flex-end"} p="2" display={{ base: "none", lg: "flex" }}>
          <IconButton
            aria-label="Toggle Navigation"
            icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            onClick={toggleCollapse}
            size="sm"
            variant="ghost"
            colorScheme="blue"
            _hover={{ bg: "blue.50" }}
          />
        </Flex>

        {/* Premium Header com Logo */}
        <Flex
          align="center"
          justify={isCollapsed ? "center" : "flex-start"}
          h="16"
          px={isCollapsed ? "2" : "4"}
          bgGradient="linear(to-r, blue.500, purple.600)"
          color="white"
          transition="all 0.3s"
          cursor="pointer"
          position="relative"
          overflow="hidden"
          _hover={{
            bgGradient: "linear(to-r, blue.600, purple.700)",
            transform: "scale(1.01)"
          }}
          _active={{
            transform: "scale(0.99)"
          }}
          onClick={() => router.push('/projects')}
          boxShadow="md"
        >
          {/* Decorative background effect */}
          <Box
            position="absolute"
            top="-50%"
            right="-20%"
            w="120px"
            h="120px"
            bg="whiteAlpha.200"
            borderRadius="full"
            filter="blur(40px)"
          />

          {isCollapsed ? (
            <Text fontWeight="extrabold" fontSize="xl" zIndex="1">AM</Text>
          ) : (
            <Text fontSize="xl" fontWeight="extrabold" letterSpacing="tight" zIndex="1">
              Azure Metrics
            </Text>
          )}
        </Flex>

        {/* User info com Glassmorphism */}
        <Box
          p="4"
          borderBottom="1px"
          borderColor="gray.100"
          bg="linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)"
          backdropFilter="blur(10px)"
        >
          <Flex align="center" justify={isCollapsed ? "center" : "flex-start"}>
            <Avatar
              size="sm"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              name="User"
              boxShadow="md"
            />
            {!isCollapsed && (
              <Box ml="3">
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                  Quality Assurance
                </Text>
                <Text fontSize="xs" color="gray.500">
                  QA Team
                </Text>
              </Box>
            )}
          </Flex>
        </Box>

        {/* Menu Items com hover premium */}
        <Box flex="1" px="2" py="6" overflowY="auto">
          <List spacing={2}>
            {menuItems.map((item: MenuItem) => {
              const isActive = isActiveRoute(item.itemUrl);
              return (
                <Tooltip key={item.itemName} label={item.itemName} placement="right" isDisabled={!isCollapsed}>
                  <ActiveLink href={item.itemUrl} shouldMatchExactHref>
                    <Box
                      px="3"
                      py="3"
                      borderRadius="xl"
                      bg={isActive ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)" : "transparent"}
                      color={isActive ? "blue.700" : "gray.600"}
                      borderLeft="3px solid"
                      borderColor={isActive ? "blue.500" : "transparent"}
                      _hover={{
                        bg: isActive ? "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)" : "gray.50",
                        color: isActive ? "blue.800" : "gray.900",
                        transform: "translateX(4px)",
                        borderColor: isActive ? "blue.600" : "blue.200",
                        boxShadow: "sm"
                      }}
                      display="flex"
                      alignItems="center"
                      justifyContent={isCollapsed ? "center" : "flex-start"}
                      fontSize="sm"
                      fontWeight={isActive ? "bold" : "medium"}
                      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                      cursor="pointer"
                    >
                      <ListIcon
                        as={item.icon}
                        fontSize="22"
                        color={isActive ? "blue.600" : "gray.400"}
                        mr={isCollapsed ? "0" : "3"}
                        flexShrink={0}
                      />
                      {!isCollapsed && <Text>{item.itemName}</Text>}
                    </Box>
                  </ActiveLink>
                </Tooltip>
              );
            })}
          </List>
        </Box>

        {/* Footer com Logout Premium */}
        <Box
          p="4"
          borderTop="1px"
          borderColor="gray.100"
          bg="gray.50"
        >
          <Tooltip label="Logout" placement="right" isDisabled={!isCollapsed}>
            <Flex
              align="center"
              justify={isCollapsed ? "center" : "flex-start"}
              px="3"
              py="3"
              borderRadius="xl"
              color="red.600"
              _hover={{
                bg: "red.50",
                color: "red.700",
                cursor: "pointer",
                transform: "translateX(4px)",
                boxShadow: "sm"
              }}
              fontSize="sm"
              fontWeight="medium"
              onClick={handleLogout}
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              <Box as={RiLogoutCircleLine} boxSize="5" mr={isCollapsed ? "0" : "3"} />
              {!isCollapsed && <Text>Sair</Text>}
            </Flex>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
}
