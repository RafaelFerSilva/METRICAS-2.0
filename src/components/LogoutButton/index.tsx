import { Box, Flex, Text } from "@chakra-ui/react";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useAuth } from "../../presentation/hooks/useAuth";

interface LogoutButtonProps {
  onLogout?: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <Box p="4" borderTop="1px" borderColor="gray.200">
      <Flex
        align="center"
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
        <Box as={RiLogoutCircleLine} boxSize="5" mr="3" />
        <Text>Logout</Text>
      </Flex>
    </Box>
  );
}