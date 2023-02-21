import * as React from "react";
import { listen } from '@tauri-apps/api/event'
import { Backdrop } from "@mui/material";
import { useSnackbar } from "notistack";
import * as _ from 'lodash';

import { readAllFiles, readAllFilesUsingWebProcess, readFilesUsingTauriProcess } from "../utils";
import { GrafContext } from "../context/GraftContext";
import { useData } from "../hooks/useData";

import Loader from "./Loader/Loader";
import AppBar from "./AppBar";
import PlotlyChart from "./GrafContainer";
import DragDrop from "./FileList/drag-drop/DragDrop";
import { LoadingsContext } from "../context/Loading";

const Index: React.FC = () => {
  const { updateData, data } = useData();
  const { graftState, setPlatform } = React.useContext(GrafContext);
  const { loading: { loading }, setLoading } = React.useContext(LoadingsContext);

  const { enqueueSnackbar } = useSnackbar()

  const handleFileUploadUsingWebProcess = async (files: FileList) => {
    setLoading(true)
    const filesData = await readAllFilesUsingWebProcess(files)
    if (filesData.contents.length) {
      updateData(filesData.contents)
    }
    if (filesData.notSupported.length) {
      enqueueSnackbar(`Not supported files: ${filesData.notSupported.join(', ')}`, { variant: 'error' })
    }
    setLoading(false)
  }

  const readFiles = async (fileList: FileList | undefined) => {
    setLoading(true)
    if (!!window.__TAURI_METADATA__) {
      updateData(await readFilesUsingTauriProcess().finally(() => setLoading(false)))
    } else {
      handleFileUploadUsingWebProcess(fileList)
    }
  }

  const handleFileDropChange = React.useCallback(async () => {
    if (!window.__TAURI_METADATA__) {
      enqueueSnackbar('File drop is not supported for now', { variant: 'error' })
      return
    }
    listen('tauri://file-drop', async event => {
      const files = await readAllFiles(event.payload)
      if (files.contents.length) {
        setLoading(true)
        updateData(await files.contents)
        setLoading(false)
      }
      if (files.notSupported.length) enqueueSnackbar(`Not supported files: ${files.notSupported.join(', ')}`, { variant: 'error' })
    })
  }, [loading])

  React.useEffect(() => {

    if (!window.__TAURI_METADATA__) {
      setPlatform('web')
    } else {
      setPlatform('desktop')
    }
    handleFileDropChange()
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
        files={data}
        content={
          <div>
            {graftState?.fileType === "csv"
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