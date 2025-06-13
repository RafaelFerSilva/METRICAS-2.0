import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import HomeMenu from './index';
import { SidebarDrawerProvider } from '../../contexts/SidebarDraweContext';

// Exemplo de como usar o componente HomeMenu atualizado
export default function HomeMenuExample() {
  return (
    <SidebarDrawerProvider>
      <Box display="flex" height="100vh">
        {/* Sidebar */}
        <HomeMenu />
        
        {/* Main content area - agora ocupa toda a altura da tela */}
        <Box 
          flex="1" 
          ml={{ base: 0, lg: "64" }} 
          p="4"
          bg="gray.100"
        >
          <Box bg="white" p="6" borderRadius="md" boxShadow="sm">
            <h1>Layout Atualizado - Sem Header!</h1>
            <p>O header foi removido e agora temos mais espaço na tela.</p>
            <p>Funcionalidades implementadas:</p>
            <ul>
              <li>✅ Header removido - mais espaço na tela</li>
              <li>✅ Logo "Azure Metrics" no topo do menu</li>
              <li>✅ Funcionalidade de logout no menu</li>
              <li>✅ Layout ocupa 100% da altura da tela</li>
              <li>✅ Rotas reais para cada página</li>
              <li>✅ Estados ativos baseados na rota atual</li>
              <li>✅ Integração com ActiveLink</li>
              <li>✅ Contexto para controle do sidebar</li>
              <li>✅ Responsividade mantida</li>
              <li>✅ Autenticação preservada</li>
            </ul>
          </Box>
        </Box>
      </Box>
    </SidebarDrawerProvider>
  );
}