import * as React from "react";
import { SnackbarProvider } from 'notistack';

import { GraftProvider } from "./context/GraftProvider";
import Index from "./components";

const App = () => {
  return (
    <GraftProvider>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: "right", vertical: "top" }} preventDuplicate>
        <Index />
      </SnackbarProvider>
    </GraftProvider>
  );
};
export default App;
