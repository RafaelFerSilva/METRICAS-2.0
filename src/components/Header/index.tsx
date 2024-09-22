import { Flex, Spacer } from "@chakra-ui/react";
import { Logo } from "./Logo";
import { Profile } from "./Profile";

export function Header() {
  return (
    <Flex
      as="header"
      bg="white"
      h="8vh"
      alignItems="center" // Centraliza verticalmente
      paddingX={4} // Adiciona espaçamento lateral
      boxShadow="sm" // Adiciona sombra sutil
      position="sticky" // Torna o header fixo no topo
      top={0} // Posiciona no topo da página
      zIndex={1000} // Garante que fique acima de outros elementos
    >
      <Logo />
      <Spacer />
      <Profile />
    </Flex>
  );
}
