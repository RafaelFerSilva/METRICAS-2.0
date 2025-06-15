import { useState } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/auth/authService'
import { useToast } from '@chakra-ui/react'

import {
  Flex,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

export default function LoginScreen() {
  const router = useRouter();
  const toast = useToast()
  const [organization, setOrganization] = useState('');
  const [projectId, setProjectId] = useState('');
  const [token, setToken] = useState('');

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      authService.login({
        organization: organization,
        project_id: projectId,
        token: token
      }).then(() => {
        router.push('/home');
      })
        .catch((err) => {
          toast({
            title: `Organization, Project ID ou Token inválidos!!!`,
            status: 'error',
            position: 'top-right',
            isClosable: true,
          })
        })
    }}>
      <FormControl isRequired>
        <Flex h="100vh" alignItems="center" justifyContent="center">
          <Flex
            flexDirection="column"
            p={12}
            borderRadius={8}
            boxShadow="lg"
          >
            <Heading mb={6} color="rgb(0, 120, 212)">Azure Metrics</Heading>
            <FormLabel>Organization</FormLabel>
            <Input
              id="organization"
              placeholder="Organization"
              type="organization"
              variant="filled"
              mb={3}
              onChange={event => setOrganization(event.currentTarget.value)}
            />
            <FormLabel>Project ID</FormLabel>
            <Input
              id="project_id"
              placeholder="Project ID"
              type="password"
              variant="filled"
              mb={6}
              onChange={event => setProjectId(event.currentTarget.value)}
            />
            <FormLabel>Personal Token</FormLabel>
            <Input
              id="token"
              placeholder="Personal Token"
              type="password"
              variant="filled"
              mb={6}
              onChange={event => setToken(event.currentTarget.value)}
            />
            <Button colorScheme="blue" mb={8} type="submit">
              Log In
            </Button>
          </Flex>
        </Flex>
      </FormControl>
    </form>
  );
}
