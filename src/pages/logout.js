import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { tokenService } from '../services/auth/tokenService';
import { Box, Text, Spinner, useToast } from '@chakra-ui/react';

export default function LogoutPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function logout() {
      try {
        await tokenService.delete();
        setLoading(false);
        router.push('/');
      } catch (error) {
        setLoading(false);
        toast({
          title: 'Erro ao fazer logout',
          description: error.message || 'Ocorreu um erro inesperado.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }
    logout();
  }, [router, toast]);

  return (
    <Box textAlign="center" mt={10}>
      {loading ? (
        <>
          <Spinner size="xl" mb={4} />
          <Text fontSize="lg">Você será redirecionado em instantes...</Text>
        </>
      ) : (
        <Text fontSize="lg" color="red.500">
          Falha ao fazer logout. Por favor, tente novamente.
        </Text>
      )}
    </Box>
  );
}