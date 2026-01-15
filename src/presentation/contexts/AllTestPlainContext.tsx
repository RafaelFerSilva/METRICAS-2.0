import React, { createContext, useContext, ReactNode } from 'react';
import { useTestCases as useTestCasesHook } from '../hooks/useTestCases';
import { TestCase } from '../../core/domain/entities/test-case.entity';

interface TestCasesContextProps {
  testCases: TestCase[];
  loading: boolean;
  error: any;
}

const TestCasesContext = createContext<TestCasesContextProps | undefined>(undefined);

// Context Consumer Hook (Legacy support)
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
  // Delegate to Clean Architecture Hook
  const { data: testCases, isLoading, error } = useTestCasesHook();

  return (
    <TestCasesContext.Provider value={{
      testCases: testCases || [],
      loading: isLoading,
      error
    }}>
      {children}
    </TestCasesContext.Provider>
  );
};
