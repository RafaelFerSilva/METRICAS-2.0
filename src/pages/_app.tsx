import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../styles/theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProfileProvider } from "../presentation/contexts/UserProfileContext";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <UserProfileProvider>
          <Component {...pageProps} />
        </UserProfileProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
