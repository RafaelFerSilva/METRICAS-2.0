import Head from 'next/head';
import { Box, Button, Container, Flex, Heading, Text, Stack, useColorModeValue, SimpleGrid, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaChartLine, FaRocket, FaCogs } from 'react-icons/fa';
import { useEffect } from 'react';
import { tokenService } from '../services/auth/tokenService';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const token = tokenService.getToken();
    if (token) {
      router.push('/projects');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Azure Metrics 2.0 - Dashboard Inteligente</title>
      </Head>

      <Box bgGradient="linear(to-br, gray.900, blue.900)" minH="100vh" color="white">

        {/* Navigation */}
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="rgba(0,0,0,0.3)" backdropFilter="blur(10px)">
          <Flex align="center" mr={5}>
            <Heading as="h1" size="lg" letterSpacing={'-.1rem'} bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
              Azure Metrics
            </Heading>
          </Flex>

          <Box>
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => router.push('/login')}
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Login
            </Button>
          </Box>
        </Flex>

        {/* Hero Section */}
        <Container maxW={'5xl'}>
          <Stack
            textAlign={'center'}
            align={'center'}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 20, md: 28 }}>
            <Heading
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
              lineHeight={'110%'}>
              Métricas do Azure DevOps <br />
              <Text as={'span'} color={'blue.400'}>
                como você nunca viu
              </Text>
            </Heading>
            <Text color={'gray.300'} maxW={'3xl'}>
              Transforme dados brutos em insights executivos. Acompanhe a velocidade, qualidade e eficiência do seu time com dashboards modernos e interativos.
            </Text>
            <Stack spacing={6} direction={'row'}>
              <Button
                rounded={'full'}
                px={6}
                colorScheme={'blue'}
                bg={'blue.400'}
                _hover={{ bg: 'blue.500' }}
                size="lg"
                onClick={() => router.push('/login')}
              >
                Acessar Plataforma
              </Button>
              {/* <Button rounded={'full'} px={6} size="lg" variant="outline" _hover={{ bg: 'whiteAlpha.100' }}>
                Saiba Mais
              </Button> */}
            </Stack>
          </Stack>
        </Container>

        {/* Features Section */}
        <Box p={4} bg="rgba(0,0,0,0.2)">
          <Container maxW={'6xl'} py={10}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              <Feature
                icon={<Icon as={FaChartLine} w={10} h={10} color="green.400" />}
                title={'Sprint Analytics'}
                text={
                  'Analise o progresso da sprint em tempo real com gráficos de burn-down, velocity e story points precisos.'
                }
              />
              <Feature
                icon={<Icon as={FaRocket} w={10} h={10} color="orange.400" />}
                title={'Eficiência de Fluxo'}
                text={
                  'Entenda o Lead Time, Cycle Time e gargalos do seu processo com métricas avançadas de fluxo.'
                }
              />
              <Feature
                icon={<Icon as={FaCogs} w={10} h={10} color="purple.400" />}
                title={'Qualidade & Testes'}
                text={
                  'Monitore a cobertura de testes, bugs e saúde do código com relatórios detalhados de QA.'
                }
              />
            </SimpleGrid>
          </Container>
        </Box>
      </Box>
    </>
  );
}

const Feature = ({ title, text, icon }: { title: string; text: string; icon: any }) => {
  return (
    <Stack align={'center'} textAlign="center">
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'whiteAlpha.100'}
        mb={1}>
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize="xl">{title}</Text>
      <Text color={'gray.400'}>{text}</Text>
    </Stack>
  );
};
