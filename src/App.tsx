import * as React from "react";
import { SnackbarProvider } from 'notistack';

import { GraftProvider } from "./context/GraftProvider";
import Index from "./components";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material";

const theme = createTheme()

const App = () => {
  return (
    <GraftProvider>
      <ThemeProvider theme={theme}>
        {/* TODO: add custom snackbar component review CustomSnackbar component */}
        <SnackbarProvider maxSnack={4} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} autoHideDuration={8000} preventDuplicate>
          <Index />
        </SnackbarProvider>
      </ThemeProvider>
    </GraftProvider>
  );
};
export default App;
