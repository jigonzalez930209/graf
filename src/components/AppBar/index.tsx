import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ClearIcon from '@mui/icons-material/Clear';

import FileList from '../FileList'
import { ProcessFile, useData } from '../../hooks/useData';
import { CssBaseline, Divider, Drawer } from '@mui/material';
import ExportModal from '../ExportModal';
import GraftHandlerPopper from '../GraftHandlerPopper';

const drawerWidth = 240;
type BarProps = {
  files: ProcessFile[]
  content: JSX.Element
  readAllFiles: () => void
}

const Bar: React.FC<BarProps> = ({ files, content, readAllFiles }) => {
  const { cleanData } = useData()
  const [open, setOpen] = React.useState(false)
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <ExportModal open={open} onClose={() => setOpen(false)} />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Graf 0.001!!
          </Typography>
          <Box sx={{ alignSelf: 'center', justifySelf: 'end' }}>
            <IconButton
              size="large"
              color="inherit"
              sx={{ marginRight: 2 }}
              onClick={readAllFiles}
            >
              <CloudUploadIcon />
            </IconButton>
            <IconButton
              size="large"
              sx={{ marginRight: 2 }}
              color={files?.length > 0 ? 'inherit' : 'error'}
              disabled={files?.length < 1}
              onClick={() => setOpen(true)}
            >
              <CloudDownloadIcon />
            </IconButton>
            <IconButton
              size="large"
              color={files?.length > 0 ? 'inherit' : 'error'}
              disabled={files?.length < 1}
              onClick={() => cleanData()}
            >
              <ClearIcon />
            </IconButton>

            <GraftHandlerPopper />

          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <FileList files={files} />
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}

export default Bar
