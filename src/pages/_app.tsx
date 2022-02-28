import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactQueryDevtools } from "react-query/devtools";
import { theme } from "../styles/theme";
import { SidebarDrawerProvider } from "../contexts/SidebarDraweContext";
import { QueryClientProvider, QueryClient } from "react-query";
import { queryClient } from "../services/queryCliente";
import { TeamsProvider } from "../contexts/TeamsContext";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
        <TeamsProvider>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <SidebarDrawerProvider>
                <Component {...pageProps} />
              </SidebarDrawerProvider>
            </ChakraProvider>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </TeamsProvider>
    </>
  );
}
export default MyApp;
