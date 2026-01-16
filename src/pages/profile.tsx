import { Grid, GridItem, Box, Container, Flex, Heading, Text, Avatar, Button, SimpleGrid, Icon, VStack, HStack, Divider, useColorModeValue, Badge, Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useUserProfile } from "../presentation/contexts/UserProfileContext";
import { tokenService } from "../services/auth/tokenService";
import { MdEmail, MdBusiness, MdFolder, MdExitToApp, MdPerson, MdSchedule } from "react-icons/md";
import { useAuth } from "../presentation/hooks/useAuth";
import { useEffect, useState } from "react";
import HomeMenu from "../presentation/components/HomeMenu";
import { SidebarDrawerProvider, useSidebarDrawer } from "../presentation/contexts/SidebarDraweContext";

export default function ProfilePage() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" emptyColor="gray.200" />
            </Center>
        );
    }

    return (
        <SidebarDrawerProvider>
            <Head>
                <title>Meu Perfil | Azure Metrics</title>
            </Head>
            <ProfileLayout />
        </SidebarDrawerProvider>
    );
}

function ProfileLayout() {
    const { isCollapsed } = useSidebarDrawer();
    const router = useRouter();
    const { userProfile, isLoading } = useUserProfile();
    const { logout } = useAuth();
    const [sessionInfo, setSessionInfo] = useState({
        organization: "",
        projectId: "",
        loginTime: ""
    });

    useEffect(() => {
        const org = tokenService.getOrganization();
        const projId = tokenService.getProjectId();
        const loginTime = localStorage.getItem('loginTime') || new Date().toISOString();

        if (!localStorage.getItem('loginTime')) {
            localStorage.setItem('loginTime', loginTime);
        }

        setSessionInfo({
            organization: org || "N/A",
            projectId: projId || "Nenhum projeto selecionado",
            loginTime: new Date(loginTime).toLocaleString('pt-BR')
        });
    }, []);

    const bgGradient = useColorModeValue("linear(to-br, gray.50, gray.100)", "linear(to-br, gray.900, black)");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.600", "gray.400");
    const headingColor = useColorModeValue("gray.800", "white");

    const handleLogout = () => {
        localStorage.removeItem('loginTime');
        logout();
    };

    return (
        <Grid
            templateAreas={`"nav main"`}
            gridTemplateColumns={{ base: '1fr', lg: isCollapsed ? '80px 1fr' : '256px 1fr' }}
            height="100vh"
            transition="grid-template-columns 0.3s ease-in-out"
            overflow="hidden"
        >
            <GridItem area={'nav'} bg="white" zIndex="sticky">
                <HomeMenu />
            </GridItem>

            <GridItem area={'main'} bgGradient={bgGradient} overflowY="auto" position="relative">
                <Container maxW="full" py={8} px={8}>

                    {/* Hero Profile Card */}
                    <Box
                        bg={cardBg}
                        borderRadius="3xl"
                        boxShadow="2xl"
                        overflow="hidden"
                        mb={8}
                        position="relative"
                    >
                        {/* Decorative Header */}
                        <Box
                            h="180px"
                            bgGradient="linear(135deg, blue.500, purple.600)"
                            position="relative"
                        >
                            <Box
                                position="absolute"
                                top="-50%"
                                right="-10%"
                                w="300px"
                                h="300px"
                                bg="whiteAlpha.200"
                                borderRadius="full"
                                filter="blur(80px)"
                            />
                        </Box>

                        {/* Profile Info - Clean & Minimalist*/}
                        <Flex
                            direction={{ base: "column", md: "row" }}
                            align={{ base: "center", md: "flex-start" }}
                            px={8}
                            pb={8}
                            mt={0}
                            paddingTop={8}
                            gap={6}
                        >
                            <Avatar
                                size="2xl"
                                name={userProfile?.displayName || "User"}
                                src={userProfile?.imageUrl || ""}
                                border="6px solid"
                                borderColor={cardBg}
                                boxShadow="xl"
                                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            />

                            <VStack align={{ base: "center", md: "flex-start" }} spacing={3} flex="1" mt={{ base: 4, md: 10 }}>
                                {/* Nome */}
                                <Heading size="2xl" color={headingColor} fontWeight="bold" letterSpacing="tight">
                                    {isLoading ? "Carregando..." : userProfile?.displayName || "Usuário"}
                                </Heading>

                                {/* Email e Badges na mesma linha */}
                                <HStack spacing={3} flexWrap="wrap" align="center" w="full">
                                    <Text
                                        color={textColor}
                                        fontSize="md"
                                        fontWeight="normal"
                                    >
                                        {userProfile?.emailAddress || "email@example.com"}
                                    </Text>

                                    <Badge colorScheme="purple" fontSize="xs" px={3} py={1} borderRadius="full" fontWeight="medium">
                                        Azure DevOps
                                    </Badge>
                                    <Badge colorScheme="green" fontSize="xs" px={3} py={1} borderRadius="full" variant="subtle">
                                        <Flex align="center" gap={1}>
                                            <Box w={2} h={2} borderRadius="full" bg="green.500" />
                                            Ativo
                                        </Flex>
                                    </Badge>
                                </HStack>
                            </VStack>

                            <VStack spacing={2} mt={{ base: 4, md: 4 }}>
                                <Button
                                    leftIcon={<MdExitToApp />}
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={handleLogout}
                                    size="md"
                                >
                                    Sair
                                </Button>
                            </VStack>
                        </Flex>
                    </Box>

                    {/* Info Cards Grid */}
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>

                        {/* Workspace Info */}
                        <Box
                            bg={cardBg}
                            p={6}
                            borderRadius="2xl"
                            boxShadow="lg"
                            transition="all 0.3s"
                            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
                        >
                            <HStack mb={4}>
                                <Flex
                                    w={12}
                                    h={12}
                                    align="center"
                                    justify="center"
                                    bgGradient="linear(to-br, blue.400, blue.600)"
                                    color="white"
                                    borderRadius="xl"
                                >
                                    <Icon as={MdBusiness} boxSize={6} />
                                </Flex>
                                <Heading size="md" color={headingColor}>Workspace</Heading>
                            </HStack>
                            <VStack align="stretch" spacing={3}>
                                <Box>
                                    <Text fontSize="sm" color={textColor} fontWeight="medium">Organização</Text>
                                    <Text fontSize="lg" color={headingColor} fontWeight="bold">{sessionInfo.organization}</Text>
                                </Box>
                                <Divider />
                                <Box>
                                    <Text fontSize="sm" color={textColor} fontWeight="medium">ID do Projeto</Text>
                                    <Text fontSize="md" color={headingColor} wordBreak="break-all">{sessionInfo.projectId}</Text>
                                </Box>
                            </VStack>
                        </Box>

                        {/* Session Info */}
                        <Box
                            bg={cardBg}
                            p={6}
                            borderRadius="2xl"
                            boxShadow="lg"
                            transition="all 0.3s"
                            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
                        >
                            <HStack mb={4}>
                                <Flex
                                    w={12}
                                    h={12}
                                    align="center"
                                    justify="center"
                                    bgGradient="linear(to-br, purple.400, purple.600)"
                                    color="white"
                                    borderRadius="xl"
                                >
                                    <Icon as={MdSchedule} boxSize={6} />
                                </Flex>
                                <Heading size="md" color={headingColor}>Sessão</Heading>
                            </HStack>
                            <VStack align="stretch" spacing={3}>
                                <Box>
                                    <Text fontSize="sm" color={textColor} fontWeight="medium">Último Login</Text>
                                    <Text fontSize="lg" color={headingColor} fontWeight="bold">{sessionInfo.loginTime}</Text>
                                </Box>
                                <Divider />
                                <Box>
                                    <Text fontSize="sm" color={textColor} fontWeight="medium">Status</Text>
                                    <HStack>
                                        <Box w={2} h={2} borderRadius="full" bg="green.500" />
                                        <Text fontSize="md" color="green.600" fontWeight="bold">Ativo</Text>
                                    </HStack>
                                </Box>
                            </VStack>
                        </Box>

                    </SimpleGrid>

                    {/* Quick Actions */}
                    <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="lg">
                        <Heading size="md" mb={6} color={headingColor}>Ações Rápidas</Heading>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                            <Button
                                leftIcon={<MdFolder />}
                                variant="outline"
                                colorScheme="blue"
                                justifyContent="flex-start"
                                onClick={() => router.push('/projects')}
                            >
                                Trocar Projeto
                            </Button>
                            <Button
                                leftIcon={<MdPerson />}
                                variant="outline"
                                colorScheme="purple"
                                justifyContent="flex-start"
                                onClick={() => router.push('/dashboard')}
                            >
                                Dashboard
                            </Button>
                            <Button
                                leftIcon={<MdExitToApp />}
                                variant="outline"
                                colorScheme="red"
                                justifyContent="flex-start"
                                onClick={handleLogout}
                            >
                                Desconectar
                            </Button>
                        </SimpleGrid>
                    </Box>

                </Container>
            </GridItem>
        </Grid>
    );
}
