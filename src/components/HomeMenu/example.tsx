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
        
        {/* Main content area */}
        <Box 
          flex="1" 
          ml={{ base: 0, lg: "64" }} 
          p="4"
          bg="gray.100"
        >
          <Box bg="white" p="6" borderRadius="md" boxShadow="sm">
            <h1>Sistema de Rotas Implementado!</h1>
            <p>O menu lateral agora usa navegação real com Next.js.</p>
            <p>Funcionalidades implementadas:</p>
            <ul>
              <li>✅ Rotas reais para cada página</li>
              <li>✅ URLs que mudam conforme a navegação</li>
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