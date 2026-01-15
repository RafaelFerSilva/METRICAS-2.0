import { Flex, Box, Avatar, Button, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { RiLogoutCircleLine } from "react-icons/ri";

export function Profile() {
  const router = useRouter();

  const signOut = () => {
    router.push('/logout')
  }
  
  return (
    <Flex>
      <Box p='2'>
        {/* {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user?.roles}</Text>
          <Text color="gray.300" fontSize="small">
            {user?.email}
          </Text>
        </Box>
      )} */}

        {/* <Avatar size="md" name="Rafael Fernandes" /> */}
        <Button
          size="sm"
          fontSize="xs"
          colorScheme="red"
          leftIcon={<Icon as={RiLogoutCircleLine} fontSize="18" />}
          onClick={signOut}
        >
          Logout
        </Button>
      </Box>
    </Flex>
  );
}
