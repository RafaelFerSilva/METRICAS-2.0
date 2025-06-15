import { SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Box, useColorModeValue } from "@chakra-ui/react";
import { Task } from "../../types/Task";


interface PercentReportCardProps {
    userStories: Task[];
    userStoriesRate: number;
    bugs: Task[];
    defects: Task[];
    problems: Task[];
    totalStoryPoints: number;
    media: number;
}


export default function PercentSprintReportCard(
  {
    userStories, 
    userStoriesRate, 
    bugs, 
    defects, 
    problems, 
    totalStoryPoints, 
    media
  }: PercentReportCardProps) {

    const cardBg = useColorModeValue('white', 'gray.800');

    return (
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          spacing={{ base: 4, md: 6 }}
          w="100%"
        >
          <Box
            bg={cardBg}
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
          >
            <Stat>
              <StatLabel color="gray.600">Taxa de Conclusão De User Stories</StatLabel>
              <StatNumber color="green.500" fontSize="2xl">
                {userStoriesRate.toFixed(1)}%
              </StatNumber>
              <StatHelpText>
                <StatArrow type={userStoriesRate >= media ? 'increase' : 'decrease'} />
                {userStoriesRate >= media ? 'Acima da média' : 'Abaixo da média'}
              </StatHelpText>
            </Stat>
          </Box>

          <Box
            bg={cardBg}
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
          >
            <Stat>
              <StatLabel color="gray.600">Story Points Médios</StatLabel>
              <StatNumber color="blue.500" fontSize="2xl">
                {userStories.length > 0 ? (totalStoryPoints / userStories.length).toFixed(1) : '0'}
              </StatNumber>
              <StatHelpText>
                Por User Story
              </StatHelpText>
            </Stat>
          </Box>

          <Box
            bg={cardBg}
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
          >
            <Stat>
              <StatLabel color="gray.600">Densidade de Bugs</StatLabel>
              <StatNumber color="red.500" fontSize="2xl">
                {userStories.length > 0 ? ((bugs.length / userStories.length) * 100).toFixed(1) : '0'}%
              </StatNumber>
              <StatHelpText>
                <StatArrow type={bugs.length <= userStories.length * 0.15 ? 'decrease' : 'increase'} />
                {bugs.length <= userStories.length * 0.1 ? 'Baixa' : 'Alta'}
              </StatHelpText>
            </Stat>
          </Box>

          <Box
            bg={cardBg}
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
          >
            <Stat>
              <StatLabel color="gray.600">Densidade de Defects</StatLabel>
              <StatNumber color="red.500" fontSize="2xl">
                {userStories.length > 0 ? ((defects.length / userStories.length) * 100).toFixed(1) : '0'}%
              </StatNumber>
              <StatHelpText>
                <StatArrow type={defects.length <= userStories.length * 0.15 ? 'decrease' : 'increase'} />
                {defects.length <= userStories.length * 0.1 ? 'Baixa' : 'Alta'}
              </StatHelpText>
            </Stat>
          </Box>

          <Box
            bg={cardBg}
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
          >
            <Stat>
              <StatLabel color="gray.600">Densidade de Problemas</StatLabel>
              <StatNumber color="red.500" fontSize="2xl">
                {userStories.length > 0 ? ((problems.length / userStories.length) * 100).toFixed(1) : '0'}%
              </StatNumber>
              <StatHelpText>
                <StatArrow type={problems.length <= userStories.length * 0.15 ? 'decrease' : 'increase'} />
                {problems.length <= userStories.length * 0.1 ? 'Baixa' : 'Alta'}
              </StatHelpText>
            </Stat>
          </Box>
        </SimpleGrid>
    )
}