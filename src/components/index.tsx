import * as React from "react";
import { listen } from '@tauri-apps/api/event'
import { Backdrop } from "@mui/material";
import { useSnackbar } from "notistack";
import * as _ from 'lodash';

import { readAllFiles, readFilesUsingTauriProcess } from "../utils/utils";
import { GrafContext } from "../context/GraftContext";
import { useData } from "../hooks/useData";

import Loader from "./Loader/Loader";
import AppBar from "./AppBar";
import PlotlyChart from "./GrafContainer";
import DragDrop from "./FileList/drag-drop/DragDrop";

const Index: React.FC = () => {
  const { updateData, data: Data } = useData();
  const { setLoading, graftState: { loading, fileType } } = React.useContext(GrafContext);

  const { enqueueSnackbar } = useSnackbar()

  const readFiles = async () => {
    setLoading(true)
    updateData(await readFilesUsingTauriProcess().finally(() => setLoading(false)))
  }

  const handleChange = React.useCallback(async () => {
    listen('tauri://file-drop', async event => {
      setLoading(true)
      const files = await readAllFiles(event.payload)
      if (files.contents.length) updateData(await files.contents)
      if (files.notSupported.length) enqueueSnackbar(`Not supported files: ${files.notSupported.join(', ')}`, { variant: 'error' })

      setLoading(false)
    })
  }, [loading])

  React.useEffect(() => {
    handleChange()
  }, [])

  return (
    <div>
      {loading && <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => { }}
      >
        <Loader type="hash" />
      </Backdrop>
      }
      <AppBar
        readAllFiles={readFiles}
        files={Data}
        content={
          <div>
            {fileType === "csv"
              ? <DragDrop PlotlyChart={<PlotlyChart />} />
              : <PlotlyChart />
            }
          </div>
        }
      />
    </div >
  );
}

export default Index;