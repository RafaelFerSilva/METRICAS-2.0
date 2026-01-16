// pages/test-cases.tsx
import { Center } from '@chakra-ui/react';
import Loading from 'react-loading';
import { TestCasesProvider, useTestCases } from '../../contexts/AllTestPlainContext'; // Ajuste o caminho conforme necessário
import TestCaseReport from '../TestCaseReport';

const TestCasesList = () => {
  const { testCases, loading, error, refetch } = useTestCases();

  if (loading) {
    return (
      <Center height="100vh">
        <Loading color='blue' type='spin' />
      </Center>
    );
  }


  if (error) {
    return <Center height="100vh"><p>{error}</p></Center>;
  }

  return (
    <div>
      <TestCaseReport testsCases={testCases} onRefresh={refetch} />
    </div>
  );
};


const TestCasesPage = () => {
  return (
    <TestCasesProvider>
      <TestCasesList />
    </TestCasesProvider>
  );
};

export default TestCasesPage;
