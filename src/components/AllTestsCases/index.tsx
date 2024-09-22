// pages/test-cases.tsx
import { Center } from '@chakra-ui/react';
import Loading from 'react-loading';
import { TestCasesProvider, useTestCases } from '../../contexts/AllTestPlainContext'; // Ajuste o caminho conforme necessário
import TestCaseReport from '../TestCaseReport';

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

  // Renderiza o componente TestCaseReport quando os dados estão disponíveis
  return (
    <div>
      <TestCaseReport testsCases={testCases} />
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
