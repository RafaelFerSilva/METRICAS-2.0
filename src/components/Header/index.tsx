import { Flex, Spacer } from "@chakra-ui/react";
import { Logo } from "./Logo";
import { Profile } from "./Profile";

export function Header() {

  return (
    <Flex
      as="header"
      bg="white"
      h="8vh"
    >
      <Logo />
      <Spacer />
      <Profile />
    </Flex>
  );
}
