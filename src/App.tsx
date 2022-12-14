import * as React from "react";

import { GraftProvider } from "./context/GraftProvider";
import Index from "./components";

const App = () => {
  return (
    <GraftProvider>
      <Index />
    </GraftProvider>
  );
};
export default App;
