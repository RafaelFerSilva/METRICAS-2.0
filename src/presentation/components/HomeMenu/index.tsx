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
        width={isCollapsed ? "20" : "64"} // Dynamic width: 5rem (80px) vs 16rem (256px)
        bg="white"
        boxShadow="lg"
        transform={{
          base: isOpen ? "translateX(0)" : "translateX(-100%)",
          lg: "translateX(0)"
        }}
        transition="all 0.3s ease-in-out"
        zIndex="50"
        display="flex"
        flexDirection="column"
        height="100vh"
      >
        {/* Toggle Button for Desktop */}
        <Flex justify={isCollapsed ? "center" : "flex-end"} p="2" display={{ base: "none", lg: "flex" }}>
          <IconButton
            aria-label="Toggle Navigation"
            icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            onClick={toggleCollapse}
            size="sm"
            variant="ghost"
          />
        </Flex>

        {/* Header com Logo Azure Metrics */}
        <Flex
          align="center"
          justify={isCollapsed ? "center" : "flex-start"}
          h="16"
          px={isCollapsed ? "2" : "4"}
          bg="blue.600"
          color="white"
          transition="all 0.3s"
        >
          {isCollapsed ? (
            <Text fontWeight="bold" fontSize="lg">AM</Text>
          ) : (
            <Text fontSize="xl" fontWeight="bold" letterSpacing="tight">
              Azure Metrics
            </Text>
          )}
        </Flex>

        {/* User info */}
        <Box p="4" borderBottom="1px" borderColor="gray.200" bg="gray.50">
          <Flex align="center" justify={isCollapsed ? "center" : "flex-start"}>
            <Avatar size="sm" bg="blue.100" color="blue.600" name="User" />
            {!isCollapsed && (
              <Box ml="3">
                <Text fontSize="sm" fontWeight="medium" color="gray.900">
                  Quality Assurance
                </Text>
              </Box>
            )}
          </Flex>
        </Box>

        <Box flex="1" px="2" py="4" overflowY="auto">
          <List spacing={1}>
            {menuItems.map((item: MenuItem) => {
              const isActive = isActiveRoute(item.itemUrl);
              return (
                <Tooltip key={item.itemName} label={item.itemName} placement="right" isDisabled={!isCollapsed}>
                  <ActiveLink href={item.itemUrl} shouldMatchExactHref>
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
                      justifyContent={isCollapsed ? "center" : "flex-start"}
                      fontSize="sm"
                      fontWeight="medium"
                      transition="all 0.2s"
                    >
                      <ListIcon
                        as={item.icon}
                        fontSize="20"
                        color={isActive ? "blue.500" : "gray.400"}
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

        {/* Footer */}
        <Box p="4" borderTop="1px" borderColor="gray.200">

          {/* Logout */}
          <Flex
            align="center"
            justify={isCollapsed ? "center" : "flex-start"}
            px="2"
            py="2"
            borderRadius="md"
            color="red.600"
            _hover={{
              bg: "red.50",
              color: "red.700",
              cursor: "pointer"
            }}
            fontSize="sm"
            fontWeight="medium"
            onClick={handleLogout}
          >
            <Box as={RiLogoutCircleLine} boxSize="5" mr={isCollapsed ? "0" : "3"} />
            {!isCollapsed && <Text>Logout</Text>}
          </Flex>
        </Box>
      </Box>
    </>
  );
}
