// pages/test-cases.tsx
import { Center } from '@chakra-ui/react';
import Loading from 'react-loading';
import { TestCasesProvider, useTestCases } from '../../contexts/AllTestPlainContext'; // Ajuste o caminho conforme necessário
import { setupAPIMetrics } from "../../services/api";
import { tokenService } from '../../services/auth/tokenService';
import TestCaseReport2 from '../TestCaseReport2';

const token = tokenService.getToken();
const project_id = tokenService.getProjectId();
const organization = tokenService.getOrganization();
const axiosInstance = setupAPIMetrics({ organization, project_id, token });

const TestCasesList = () => {
  const { testCases, loading, error } = useTestCases();

  // Renderiza o indicador de carregamento enquanto os dados estão sendo carregados
  if (loading) {
    return (
      <Center height="100vh">
        <Loading color='blue' type='spin' />
      </Center>
    );
  }

  // Renderiza uma mensagem de erro, se houver algum erro
  if (error) {
    return <Center height="100vh"><p>{error}</p></Center>;
  }

  // Renderiza o componente TestCaseReport2 quando os dados estão disponíveis
  return (
    <div>
      <TestCaseReport2 testsCases={testCases} />
    </div>
  );
};

// Página principal que usa o contexto
const TestCasesPage = () => {
  return (
    <TestCasesProvider>
      <TestCasesList />
    </TestCasesProvider>
  );
};

export default TestCasesPage;
