import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/auth/authService';
import { tokenService } from '../services/auth/tokenService';
import { useUserProfile } from '../presentation/contexts/UserProfileContext';
import { useToast, Flex, Heading, Input, Button, FormControl, FormLabel, Box, Text, useColorModeValue } from '@chakra-ui/react';
import Head from 'next/head';

export default function LoginPage() {
    const router = useRouter();
    const toast = useToast();
    const [organization, setOrganization] = useState('');
    const [projectId, setProjectId] = useState('');
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Modern Colors
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const glassBg = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(26, 32, 44, 0.8)");
    const { refreshProfile } = useUserProfile();

    // Check if already authenticated
    useEffect(() => {
        const existingToken = tokenService.getToken();
        if (existingToken) {
            router.push('/projects');
        }
    }, [router]);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);


        try {
            await authService.login({
                organization: organization,
                token: token
            });
            toast({
                title: 'Login realizado com sucesso!',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });

            // Fetch user profile immediately after login
            await refreshProfile();

            router.push('/projects');
        } catch (err) {
            toast({
                title: 'Falha no Login',
                description: 'Verifique sua Organization e Token.',
                status: 'error',
                position: 'top-right',
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Login | Azure Metrics 2.0</title>
            </Head>
            <Flex
                h="100vh"
                alignItems="center"
                justifyContent="center"
                bgGradient="linear(to-br, blue.400, purple.600)"
                position="relative"
                overflow="hidden"
            >
                {/* Animated Background Elements (Optional decorative circles) */}
                <Box
                    position="absolute"
                    top="-10%"
                    left="-10%"
                    w="500px"
                    h="500px"
                    bg="blue.300"
                    borderRadius="full"
                    filter="blur(150px)"
                    opacity="0.6"
                />
                <Box
                    position="absolute"
                    bottom="-10%"
                    right="-10%"
                    w="500px"
                    h="500px"
                    bg="purple.500"
                    borderRadius="full"
                    filter="blur(150px)"
                    opacity="0.6"
                />

                <Flex
                    as="form"
                    onSubmit={handleLogin}
                    flexDirection="column"
                    p={10}
                    borderRadius="2xl"
                    boxShadow="2xl"
                    bg={glassBg}
                    backdropFilter="blur(20px)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    w={{ base: "90%", md: "450px" }}
                    zIndex="1"
                >
                    <Heading mb={2} textAlign="center" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text" fontWeight="extrabold">
                        Azure Metrics
                    </Heading>
                    <Text mb={8} textAlign="center" color="gray.500" fontSize="sm">
                        Entre para visualizar seus dashboards
                    </Text>

                    <FormControl isRequired mb={4}>
                        <FormLabel color="gray.600" fontSize="sm" fontWeight="bold">Organization</FormLabel>
                        <Input
                            id="organization"
                            placeholder="ex: minha-organizacao"
                            type="text"
                            variant="filled"
                            bg="whiteAlpha.500"
                            _hover={{ bg: "whiteAlpha.800" }}
                            _focus={{ bg: "white", borderColor: "blue.400" }}
                            borderRadius="lg"
                            size="lg"
                            onChange={event => setOrganization(event.currentTarget.value)}
                        />
                    </FormControl>

                    <FormControl isRequired mb={8}>
                        <FormLabel color="gray.600" fontSize="sm" fontWeight="bold">Personal Access Token (PAT)</FormLabel>
                        <Input
                            id="token"
                            placeholder="••••••••••••••••••••"
                            type="password"
                            variant="filled"
                            bg="whiteAlpha.500"
                            _hover={{ bg: "whiteAlpha.800" }}
                            _focus={{ bg: "white", borderColor: "blue.400" }}
                            borderRadius="lg"
                            size="lg"
                            onChange={event => setToken(event.currentTarget.value)}
                        />
                    </FormControl>

                    <Button
                        colorScheme="blue"
                        size="lg"
                        type="submit"
                        isLoading={isLoading}
                        loadingText="Entrando..."
                        bgGradient="linear(to-r, blue.400, purple.500)"
                        _hover={{
                            bgGradient: "linear(to-r, blue.500, purple.600)",
                            transform: "translateY(-2px)",
                            boxShadow: "lg"
                        }}
                        _active={{
                            transform: "translateY(0)",
                        }}
                        borderRadius="lg"
                        fontWeight="bold"
                    >
                        Acessar Dashboard
                    </Button>

                    <Text mt={6} textAlign="center" fontSize="xs" color="gray.400">
                        Versão 2.0
                    </Text>
                </Flex>
            </Flex>
        </>
    );
}
