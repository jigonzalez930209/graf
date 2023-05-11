import * as React from 'react';
import { useSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';

import Tooltip from '../Tooltip';
import { LoadingsContext } from '../../context/Loading'
import { GrafContext } from '../../context/GraftContext'
import { increaseSize, openProject, saveProject } from '../../utils'

const ProjectHandler = () => {
  const { graftState, setGraftState } = React.useContext(GrafContext)
  const { setLoading } = React.useContext(LoadingsContext)
  const { enqueueSnackbar } = useSnackbar()
  const open = async () => {
    setLoading(true)
    const dat = await openProject()
    dat?.data && setGraftState(dat?.data)
    enqueueSnackbar(dat.notification.message, { variant: dat.notification.variant })
    setLoading(false)
  }
  const save = async () => {
    setLoading(true)
    const notification = await saveProject(graftState)
    enqueueSnackbar(notification.message, { variant: notification.variant })
    setLoading(false)
  }

  return (
    <>
      <Tooltip title='Open saved project'>
        <span>
          <IconButton size='small' color='inherit' sx={{ mr: 1 }} onClick={open}>
            <OpenInBrowserIcon
              sx={{
                '&:hover': {
                  ...increaseSize,
                },
              }}
              fontSize='small'
            />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title='Save a current project'>
        <span>
          <IconButton
            size='small'
            color='inherit'
            sx={{
              'mr': 1,
              '&:hover': {
                ...increaseSize,
              },
            }}
            onClick={save}
            disabled={graftState?.files?.length === 0}
          >
            <SaveAltIcon fontSize='small' />
          </IconButton>
        </span>
      </Tooltip>
    </>
  )
}

export default ProjectHandler