import "regenerator-runtime/runtime";
import "../styles/globals.css";
import "@fontsource/source-code-pro/400.css";
import "@fontsource/rubik-distressed/400.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../lib/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
