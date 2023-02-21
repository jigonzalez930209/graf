import * as React from 'react';

import { GrafContext } from './GraftContext';
import { IGraftState, INotification, IFileType, IGrafType, IGraftImpedanceType, IStepBetweenPoints, csvFileColum, ProcessFile, IPlatform } from '../interfaces/interfaces';
import { graftReducer } from './graftReducer';

export const INITIAL_STATE: IGraftState = {
  notifications: {
    content: [''],
    title: '',
    type: null
  },
  state: {},
  fileType: null,
  loading: false,
  graftType: 'scatter',
  impedanceType: 'Nyquist',
  stepBetweenPoints: 30,
  drawerOpen: true,
  csvFileColum: [],
  files: [],
  platform: null
}

interface props {
  children: JSX.Element | JSX.Element[]
  initialState: IGraftState
}

export const GraftProvider = ({ children, initialState }: props) => {
  const [graftState, dispatch] = React.useReducer(graftReducer, initialState);

  const setNotification = (notification: INotification) =>
    dispatch({ type: 'setNotification', payload: notification })

  const setSelectedFile = (selectedFileType: IFileType) => dispatch({ type: 'setFileType', payload: selectedFileType })

  const setGraftType = (type: IGrafType) => dispatch({ type: 'setGraftType', payload: type })

  const setImpedanceType = (type: IGraftImpedanceType) => dispatch({ type: 'setImpedanceType', payload: type })

  const setStepBetweenPoints = (step: IStepBetweenPoints) => dispatch({ type: 'setStepBetweenPoints', payload: step })

  const setDrawerOpen = (open: boolean) => dispatch({ type: 'setDrawerOpen', payload: open })

  const setSelectedColumns = (filesColumns: csvFileColum[]) => dispatch({ type: 'setSelectedColumns', payload: filesColumns })
  const setFiles = (files: ProcessFile[]) => dispatch({ type: 'setFiles', payload: files })
  const setGraftState = (graftState: IGraftState) => dispatch({ type: 'setGraftState', payload: graftState })

  const updateFile = (file: ProcessFile) => dispatch({ type: 'updateFile', payload: file })

  const updateCSVfileColumn = (csvFileColum: csvFileColum) => dispatch({ type: 'updateCSVfileColumn', payload: csvFileColum })

  const setPlatform = (platform: IPlatform) => dispatch({ type: 'setPlatform', payload: platform })
  React.useEffect(() => {
    setGraftState(initialState)
  }, [initialState]);

  return (
    <GrafContext.Provider value={{
      graftState,
      setNotification,
      setSelectedFile,
      setGraftType,
      setImpedanceType,
      setStepBetweenPoints,
      setDrawerOpen,
      setSelectedColumns,
      setFiles,
      updateFile,
      updateCSVfileColumn,
      setGraftState,
      setPlatform
    }}>
      {children}
    </GrafContext.Provider>
  )
}