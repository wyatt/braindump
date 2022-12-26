import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: `'Rubik Distressed', cursive`,
    body: `'Source Code Pro', monospace`,
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: "normal",
      },
    },
  },
});
