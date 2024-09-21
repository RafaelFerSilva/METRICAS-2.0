import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { fetchAllTestCasesWiql } from '../services/azureDevOps'; // Ajuste o caminho conforme necessário

interface TestCase {
  id: number;
  name: string;
  // Adicione outros campos conforme necessário
}

interface TestCasesContextProps {
  testCases: TestCase[];
  loading: boolean;
  error: string | null;
}

const TestCasesContext = createContext<TestCasesContextProps | undefined>(undefined);

export const useTestCases = () => {
  const context = useContext(TestCasesContext);
  if (!context) {
    throw new Error('useTestCases must be used within a TestCasesProvider');
  }
  return context;
};

interface TestCasesProviderProps {
  children: ReactNode;
}

export const TestCasesProvider: React.FC<TestCasesProviderProps> = ({ children }) => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const cases = await fetchAllTestCasesWiql();
        setTestCases(cases);
      } catch (err) {
        setError(`Failed to fetch test cases: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <TestCasesContext.Provider value={{ testCases, loading, error }}>
      {children}
    </TestCasesContext.Provider>
  );
};
