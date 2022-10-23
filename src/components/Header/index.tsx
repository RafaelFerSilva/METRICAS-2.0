import { Flex, Spacer } from "@chakra-ui/react";
import { Logo } from "./Logo";
import { Profile } from "./Profile";

export function Header() {

  return (
    <Flex
      as="header"
      bg="white"
      borderRadius="8"
      px="6"
      h="20"
    >
      <Logo />
      <Spacer />
      <Profile />
    </Flex>
  );
}
