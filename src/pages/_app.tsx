import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactQueryDevtools } from "react-query/devtools";
import { theme } from "../styles/theme";
import { SidebarDrawerProvider } from "../contexts/SidebarDraweContext";
// import { makeServer } from "../services/mirage";
import { QueryClientProvider, QueryClient } from "react-query";
import { queryClient } from "../services/queryCliente";
import { AuthProvider } from "../contexts/AuthContext";

// if (process.env.NODE_ENV === "development") {
//   makeServer();
// }

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <SidebarDrawerProvider>
            <Component {...pageProps} />
          </SidebarDrawerProvider>
        </ChakraProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </AuthProvider>
  );
}
export default MyApp;
