import { Flex, Box, Text, Avatar, Button, Icon } from "@chakra-ui/react";
import { useContext } from "react";
import { RiLogoutCircleLine } from "react-icons/ri";
import { AuthContext } from "../../contexts/AuthContext";

interface ProfileProps {
  showProfileData: boolean;
}

export function Profile({ showProfileData }: ProfileProps) {
  const { user, signOut } = useContext(AuthContext);

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user?.roles}</Text>
          <Text color="gray.300" fontSize="small">
            {user?.email}
          </Text>
        </Box>
      )}

      <Avatar size="md" name="Rafael Fernandes" />
      <Button
        as="a"
        ml="4"
        size="sm"
        fontSize="sm"
        colorScheme="red"
        leftIcon={<Icon as={RiLogoutCircleLine} fontSize="20" />}
        onClick={signOut}
      >
        Sair
      </Button>
    </Flex>
  );
}
