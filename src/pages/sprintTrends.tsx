import { Grid, GridItem, Box, Center, Spinner } from "@chakra-ui/react";
import { useAuth } from "../presentation/hooks/useAuth";
import HomeMenu from "../presentation/components/HomeMenu";
import SprintTrends from "../presentation/components/SprintTrends";
import { SidebarDrawerProvider, useSidebarDrawer } from "../presentation/contexts/SidebarDraweContext";

export default function SprintTrendsPage() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" color="blue.500" />
            </Center>
        );
    }

    return (
        <SidebarDrawerProvider>
            <SprintTrendsLayout />
        </SidebarDrawerProvider>
    );
}

function SprintTrendsLayout() {
    const { isCollapsed } = useSidebarDrawer();
    return (
        <Grid
            templateAreas={`"nav main"`}
            gridTemplateColumns={{ base: '1fr', lg: isCollapsed ? '80px 1fr' : '256px 1fr' }}
            height="100vh"
            transition="grid-template-columns 0.3s ease-in-out"
        >
            <GridItem area={'nav'} bg="gray.50" p={0}>
                <HomeMenu />
            </GridItem>

            <GridItem area={'main'} bg="white" p={4} overflow="auto">
                <Box borderRadius="md" boxShadow="md" minH="100%">
                    <SprintTrends />
                </Box>
            </GridItem>
        </Grid>
    );
}
