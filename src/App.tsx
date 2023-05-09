import * as React from 'react'
import { SnackbarProvider } from 'notistack'

import { GraftProvider, INITIAL_STATE } from './context/GraftProvider'
import Index from './components'
import { ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material'
import { LoadingProvider } from './context/Loading'

const theme = createTheme()

const App = () => {
  return (
    <GraftProvider initialState={INITIAL_STATE}>
      <LoadingProvider initialState={true}>
        <ThemeProvider theme={theme}>
          {/* TODO: add custom snackbar component review CustomSnackbar component */}
          <SnackbarProvider
            maxSnack={4}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            autoHideDuration={8000}
            preventDuplicate
          >
            <Index />
          </SnackbarProvider>
        </ThemeProvider>
      </LoadingProvider>
    </GraftProvider>
  )
}
export default App
