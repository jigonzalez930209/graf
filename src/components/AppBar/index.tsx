import * as React from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import SaveIcon from '@mui/icons-material/Save'
import styled from '@mui/material/styles/styled'
import ClearIcon from '@mui/icons-material/Clear'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import { CssBaseline, Divider, Drawer } from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import Tooltip from '../Tooltip'
import FileList from '../FileList'
import { useData } from '../../hooks/useData'
import ExportModal from '../ExportModal'
import GraftHandlerPopper from '../GraftHandlerPopper'
import { GrafContext } from '../../context/GraftContext'
import { IPlatform, ProcessFile } from '../../interfaces/interfaces'
import DataSelectorDialog from '../FileContent/DataSelect'
import FileUploader from '../FileUploadWeb'
import { HelpDialog } from '../Help'
import { jelloVertical } from '../../utils'

import ProjectHandler from './ProjectHandler'

const StyledToolbar = styled(Toolbar)(() => ({
  'paddingTop': 0,
  'paddingBottom': 0,
  // Override media queries injected by theme.mixins.toolbar
  '@media all': {
    minHeight: 30,
  },
}))

const drawerWidth = 240
type BarProps = {
  files: ProcessFile[]
  content: JSX.Element
  readAllFiles: (fileList: FileList | undefined) => void
  platform: IPlatform
}

const Bar: React.FC<BarProps> = ({ files, content, readAllFiles, platform }) => {
  const { cleanData } = useData()
  const [open, setOpen] = React.useState<{ exp: boolean; dataSelect }>({ exp: false, dataSelect: false })
  const {
    graftState: { drawerOpen, fileType },
    setDrawerOpen,
  } = React.useContext(GrafContext)
  const [logsDrawerOpen, setLogsDrawerOpen] = React.useState(false)

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <ExportModal open={open.exp} onClose={() => setOpen(prev => ({ ...prev, exp: false }))} />
      {fileType === 'csv' && (
        <DataSelectorDialog
          file={files?.find(f => f.selected)}
          open={open.dataSelect}
          onClose={() => setOpen(prev => ({ ...prev, dataSelect: false }))}
        />
      )}
      <AppBar position='fixed' sx={{ zIndex: theme => theme.zIndex.drawer + 1, minHeight: 30 }}>
        <StyledToolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tooltip title="Open & Close 'Drawer'" placement='bottom'>
            <span>
              <IconButton
                onClick={() => setDrawerOpen(!drawerOpen)}
                color='inherit'
                edge='start'
                size='small'
                sx={{
                  '&:hover': {
                    ...jelloVertical,
                  },
                }}
              >
                {drawerOpen ? (
                  <ChevronLeftIcon fontSize='inherit' />
                ) : (
                  <ChevronRightIcon fontSize='inherit' />
                )}
              </IconButton>
            </span>
          </Tooltip>
          <Typography variant='h6' sx={{ fontSize: '15px' }} noWrap component='div'>
            Graf 0.1.5 {'  '} {platform}
          </Typography>
          <Box sx={{ alignSelf: 'center', justifySelf: 'end' }}>
            <Tooltip title='Open files' placement='bottom'>
              <span>
                {platform === 'desktop' && (
                  <IconButton
                    size='small'
                    color='inherit'
                    sx={{
                      marginRight: 1,
                    }}
                    onClick={() => readAllFiles(null)}
                  >
                    <FileOpenIcon
                      sx={{
                        '&:hover': {
                          ...jelloVertical,
                        },
                      }}
                      fontSize='inherit'
                    />
                  </IconButton>
                )}
                {platform === 'web' && (
                  <FileUploader handleFile={readAllFiles}>
                    <FileOpenIcon
                      sx={{
                        '&:hover': {
                          ...jelloVertical,
                        },
                      }}
                      fontSize='inherit'
                    />
                  </FileUploader>
                )}
              </span>
            </Tooltip>
            {platform === 'desktop' && <ProjectHandler />}
            <Tooltip title='Download file' placement='bottom'>
              <span>
                <IconButton
                  size='small'
                  sx={{ marginRight: 1 }}
                  color={files?.length > 0 || fileType === 'csv' ? 'inherit' : 'error'}
                  disabled={files?.length < 1 || fileType === 'csv'}
                  onClick={() => setOpen(prev => ({ ...prev, exp: true }))}
                >
                  <SaveIcon
                    sx={{
                      '&:hover': {
                        ...jelloVertical,
                      },
                    }}
                    fontSize='inherit'
                  />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title='View the data contained in the selected file' placement='bottom'>
              <span>
                <IconButton
                  size='small'
                  sx={{ marginRight: 1 }}
                  color={files?.length > 0 ? 'inherit' : 'error'}
                  disabled={fileType !== 'csv'}
                  onClick={() => setOpen(prev => ({ ...prev, dataSelect: true }))}
                >
                  <DescriptionIcon
                    sx={{
                      '&:hover': {
                        ...jelloVertical,
                      },
                    }}
                    fontSize='inherit'
                  />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title='Eliminate data cache' placement='bottom'>
              <span>
                <IconButton
                  size='small'
                  sx={{ marginRight: 1 }}
                  color={files?.length > 0 ? 'inherit' : 'error'}
                  disabled={!files?.length}
                  onClick={async () => {
                    await alert('All data wold be clean and all changes its wos lost ')
                    cleanData()
                  }}
                >
                  <ClearIcon
                    sx={{
                      '&:hover': {
                        ...jelloVertical,
                      },
                    }}
                    fontSize='inherit'
                  />
                </IconButton>
              </span>
            </Tooltip>
            <GraftHandlerPopper />
            <Tooltip title='Help' placement='bottom'>
              <span>
                <HelpDialog />
              </span>
            </Tooltip>
          </Box>
        </StyledToolbar>
      </AppBar>
      <Drawer
        variant='persistent'
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
            color='inherit'
            size='small'
            edge='start'
            sx={{
              position: 'absolute',
              bottom: logsDrawerOpen ? drawerWidth - 10 : 10,
              left: drawerWidth * 0.8,
              zIndex: 5000,
              transform: 'scale(0.8)',
              backgroundColor: 'grey.300',
            }}
          >
            {logsDrawerOpen ? (
              <KeyboardArrowDownIcon fontSize='inherit' />
            ) : (
              <KeyboardArrowUpIcon fontSize='inherit' />
            )}
          </IconButton>
          <Drawer
            variant='persistent'
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
                backgroundColor: 'grey.800',
              },
            }}
          ></Drawer>
        </Box>
      </Drawer>
      <Box component='main' sx={{ flexGrow: 1, p: 0, paddingTop: '40px', paddingLeft: '10px' }}>
        {content}
      </Box>
    </Box>
  )
}

export default Bar
