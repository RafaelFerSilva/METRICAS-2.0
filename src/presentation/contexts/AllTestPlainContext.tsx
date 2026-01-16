import React, { createContext, useContext, ReactNode } from 'react';
import { useTestCases as useTestCasesHook } from '../hooks/useTestCases';
import { TestCase } from '../../core/domain/entities/test-case.entity';
import { useQueryClient } from 'react-query';
import { AzureFields } from '../../core/config/azure-fields';

interface TestCasesContextProps {
  testCases: TestCase[];
  loading: boolean;
  error: any;
  refetch: () => void;
  updateLocalItem: (id: string, partialFields: Record<string, any>) => void;
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
  const { data: testCases, isLoading, error, refetch } = useTestCasesHook();
  const queryClient = useQueryClient();

  const updateLocalItem = (id: string, partialFields: Record<string, any>) => {
    queryClient.setQueryData<TestCase[]>(['all-test-cases'], (oldData) => {
      if (!oldData) return [];

      return oldData.map((item: any) => {
        // Check for various ID fields (System.Id, id, etc)
        const itemId = item[AzureFields.Id] || item['System.Id'] || item['id'];

        if (String(itemId) === String(id)) {
          // Merge existing fields with updates
          // We need to handle the structure of the item. 
          // The item from getAllTestCases is likely flattened or has a clean structure.
          // Let's assume it's the raw object as returned by the gateway.
          const updatedItem = { ...item, ...partialFields };

          // Also update the 'fields' property if it exists (gateways sometimes return {id, fields: {...}})
          // But based on useTestCaseData, it seems flattened?
          // "item.fields" is used in useTestCaseData: ".map((item: any) => ({ id: item.id || "", ...item.fields }));"
          // Wait, the hook returns `TestCase[]`. The Gateway returns `TestCase[]`. 
          // In Gateway: `allTestCases.push(...detailsResponse.data.value);` 
          // This suggests it returns the raw Azure DevOps objects (which have `fields` property).

          if (updatedItem.fields) {
            updatedItem.fields = { ...updatedItem.fields, ...partialFields };
          }
          return updatedItem;
        }
        return item;
      });
    });
  };

  return (
    <TestCasesContext.Provider value={{
      testCases: testCases || [],
      loading: isLoading,
      error,
      refetch: () => refetch(),
      updateLocalItem
    }}>
      {children}
    </TestCasesContext.Provider>
  );
};
