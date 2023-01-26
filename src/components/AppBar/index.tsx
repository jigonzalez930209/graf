import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CssBaseline, Divider, Drawer } from '@mui/material';

import FileList from '../FileList'
import { useData } from '../../hooks/useData';
import ExportModal from '../ExportModal';
import GraftHandlerPopper from '../GraftHandlerPopper';
import { GrafContext } from '../../context/GraftContext';
import Logs from '../LogsComponent';
import { ProcessFile } from '../../interfaces/interfaces';
import Tooltip from '../Tooltip';
import styled from '@mui/material/styles/styled';

const StyledToolbar = styled(Toolbar)(() => ({
  paddingTop: 0,
  paddingBottom: 0,
  // Override media queries injected by theme.mixins.toolbar
  '@media all': {
    minHeight: 30,
  },
}));

const drawerWidth = 240;
type BarProps = {
  files: ProcessFile[]
  content: JSX.Element
  readAllFiles: () => void
}

const Bar: React.FC<BarProps> = ({ files, content, readAllFiles }) => {
  const { cleanData } = useData()
  const [open, setOpen] = React.useState(false)
  const { graftState: { drawerOpen, fileType }, setDrawerOpen } = React.useContext(GrafContext)
  const [logsDrawerOpen, setLogsDrawerOpen] = React.useState(false)

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <ExportModal open={open} onClose={() => setOpen(false)} />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, minHeight: 30 }}>
        <StyledToolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tooltip title="Open & Close 'Drawer'" placement="bottom">
            <IconButton
              onClick={() => setDrawerOpen(!drawerOpen)}
              color="inherit"
              edge="start"
              size="small"
            >
              {drawerOpen ? <ChevronLeftIcon fontSize='inherit' /> : <ChevronRightIcon fontSize='inherit' />}
            </IconButton>
          </Tooltip>
          <Typography variant="h6" sx={{ fontSize: '15px' }} noWrap component="div">
            Graf 0.1.1
          </Typography>
          <Box sx={{ alignSelf: 'center', justifySelf: 'end' }}>
            <Tooltip title="Open files" placement="bottom">
              <IconButton
                size="small"
                color="inherit"
                sx={{ marginRight: 2 }}
                onClick={readAllFiles}
              >
                <FileOpenIcon fontSize='inherit' />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download file" placement="bottom">
              <IconButton
                size="small"
                sx={{ marginRight: 2 }}
                color={(files?.length > 0 || fileType === 'csv') ? 'inherit' : 'error'}
                disabled={(files?.length < 1 || fileType === 'csv')}
                onClick={() => setOpen(true)}
              >
                <SaveIcon fontSize='inherit' />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminate data cache" placement="bottom">
              <IconButton
                size="small"
                color={files?.length > 0 ? 'inherit' : 'error'}
                disabled={files?.length < 1}
                onClick={() => cleanData()}
              >
                <ClearIcon fontSize='inherit' />
              </IconButton>
            </Tooltip>

            <GraftHandlerPopper />
          </Box>
        </StyledToolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          ...(drawerOpen ? { display: 'block' } : { display: 'none' }),
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <StyledToolbar />
        <Divider />
        <Box>
          <FileList files={files} />
          <Divider />
          <IconButton
            onClick={() => setLogsDrawerOpen(!logsDrawerOpen)}
            color="inherit"
            size="small"
            edge="start"
            sx={{
              position: 'absolute',
              bottom: logsDrawerOpen ? drawerWidth - 10 : 10,
              left: drawerWidth * .8,
              zIndex: 5000,
              transform: 'scale(0.8)',
              backgroundColor: 'grey.300',
            }}
          >
            {logsDrawerOpen ? <KeyboardArrowDownIcon fontSize='inherit' /> : <KeyboardArrowUpIcon fontSize='inherit' />}
          </IconButton>
          <Drawer
            variant="persistent"
            anchor='bottom'
            open={logsDrawerOpen}
            sx={{
              width: drawerWidth,
              height: drawerWidth,

              flexShrink: 0,
              ...(logsDrawerOpen ? { display: 'block' } : { display: 'none' }),
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
                overflow: 'hidden',
                height: drawerWidth,
                backgroundColor: 'grey.800'
              },
            }}
          >
            <Logs />
          </Drawer>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0, paddingTop: '40px', paddingLeft: '10px' }}>
        {content}
      </Box>
    </Box>
  );
}

export default Bar
