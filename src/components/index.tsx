import * as React from "react";
import { Backdrop } from "@mui/material";
import * as _ from 'lodash';

import { readFilesUsingTauriProcess } from "../utils/utils";
import Loader from "./Loader/Loader";

import { useData } from "../hooks/useData";
import AppBar from "./AppBar";
import { GrafContext } from "../context/GraftContext";
import PlotlyChart from "./GrafContainer";

const Index: React.FC = () => {
  const { updateData, data: Data } = useData();
  const { setLoading, graftState: { impedanceType, loading } } = React.useContext(GrafContext);

  const readAllFiles = async () => {
    setLoading(true)
    updateData(await readFilesUsingTauriProcess().finally(() => setLoading(false)))
  }

  return (
    <div className="container" >
      {loading && <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => { }}
      >
        <Loader type="hash" />
      </Backdrop>
      }
      <AppBar
        readAllFiles={readAllFiles}
        files={Data}
        content={
          <div>
            <PlotlyChart />
          </div>
        }
      />
    </div >
  );
}

export default Index;