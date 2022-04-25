import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../styles/theme";
import { SidebarDrawerProvider } from "../contexts/SidebarDraweContext";
import { TeamsProvider } from "../contexts/TeamsContext";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
        <TeamsProvider>
            <ChakraProvider theme={theme}>
              <SidebarDrawerProvider>
                <Component {...pageProps} />
              </SidebarDrawerProvider>
            </ChakraProvider>
        </TeamsProvider>
    </>
  );
}
export default MyApp;
