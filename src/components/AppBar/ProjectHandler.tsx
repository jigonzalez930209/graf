import * as React from 'react';
import { IconButton, InputLabel, MenuItem, Paper, Popover, Select, Box, Grid, Typography, Slider } from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import BookIcon from '@mui/icons-material/Book';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import Tooltip from '../Tooltip';
import { openProject, saveProject } from '../../utils/utils';
import { GrafContext } from '../../context/GraftContext';
import { useSnackbar } from 'notistack';
import { INITIAL_STATE } from '../../context/GraftProvider';
import { LoadingsContext } from '../../context/Loading';


const ProjectHandler = () => {
  const { graftState, setGraftState } = React.useContext(GrafContext);
  const { setLoading } = React.useContext(LoadingsContext);
  const { enqueueSnackbar } = useSnackbar();
  const open = async () => {
    setLoading(true)
    const dat = await openProject();
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
        <IconButton
          size='small'
          color='inherit'
          sx={{ mr: 1 }}
          onClick={open}
        >
          <OpenInBrowserIcon fontSize='small' />
        </IconButton>
      </Tooltip>
      <Tooltip title='Save a current project'>
        <IconButton
          size='small'
          color='inherit'
          sx={{ mr: 1 }}
          onClick={save}
        >
          <SaveAltIcon fontSize='small' />
        </IconButton>
      </Tooltip>

    </>
  )
}

export default ProjectHandler