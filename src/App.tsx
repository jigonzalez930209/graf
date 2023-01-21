import * as React from "react";
import { SnackbarProvider } from 'notistack';

import { GraftProvider } from "./context/GraftProvider";
import Index from "./components";

const App = () => {
  return (
    <GraftProvider>
      {/* TODO: add custom snackbar component review CustomSnackbar component */}
      <SnackbarProvider maxSnack={4} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} autoHideDuration={8000} preventDuplicate>
        <Index />
      </SnackbarProvider>
    </GraftProvider>
  );
};
export default App;
