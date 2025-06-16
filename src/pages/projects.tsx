import { Grid, GridItem, Box, Heading, Text, SimpleGrid, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import SimpleCard from "../components/ModernCard/SimpleCard";
import { authService } from '../services/auth/authService';
import { useEffect, useState } from "react";
import { tokenService } from "../services/auth/tokenService";
import LogoutButton from "../components/LogoutButton";

export default function ProjectsPage() {
  const router = useRouter();
  const token = tokenService.getToken();
  const organization = tokenService.getOrganization();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!token || !organization) {
      router.push('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const projectsData = await authService.login({ organization, token });
        setProjects(projectsData);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, [organization, token, router]);

  return (
    <Grid>
      <Box position="absolute" top="4" right="4" zIndex="1" borderColor="gray.200" borderRadius="md"> 
        <LogoutButton />
      </Box>
      <GridItem marginBottom="10">
        <Box borderRadius="md" boxShadow="md" p={6}>
          <Heading size="lg" mb={4} color="blue.600">
            Projects
          </Heading>
          <Text mb={4}>
            Bem-vindo ao Dashboard de Métricas do Azure DevOps!
          </Text>
          <Text color="gray.600">
            Selecione um dos projetos disponíveis para visualizar os relatórios e métricas disponíveis.
          </Text>
        </Box>
      </GridItem>
      <VStack >
        <SimpleGrid
          columns={{ base: 2, lg: 2 }}
          spacing={{ base: 4, md: 6 }}
          w="90%">
          {projects.map((project) => (
            <SimpleCard key={project.id} title={project.name} onClick={() => {
              tokenService.saveProjectId(project.id);
              router.push('/dashboard');
            }}>
            </SimpleCard>
          ))}
        </SimpleGrid>
      </VStack>
    </Grid>
  );
}