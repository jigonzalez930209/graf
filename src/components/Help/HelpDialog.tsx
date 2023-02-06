import * as React from 'react';
import fs from 'fs';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import HelpIcon from '@mui/icons-material/Help';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/styles';
import ListHelpItems from './components/ListHelpItems';
import MdText from './components/Text';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledToolbar = styled(Toolbar)(() => ({
  paddingTop: 0,
  paddingBottom: 0,
  // Override media queries injected by theme.mixins.toolbar
  '@media all': {
    height: 30,
  },
}));

export default function FullScreenDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (id: number) => setItems(
    prev => prev.map(
      item => item.id === id
        ? { ...item, selected: true }
        : { ...item, selected: false }
    ))

  const [items, setItems] = React.useState<{
    id: number;
    title: string;
    content: string;
    file: string;
    selected: boolean;
  }[]>([{
    id: 1,
    title: 'Get Started',
    content: 'not contente',
    selected: true,
    file: 'home.md'
  }, {
    id: 2,
    title: 'File Handler',
    content: 'not contente',
    selected: false,
    file: 'file-handler.md'
  }, {
    id: 3,
    title: 'Plot Area',
    content: 'not contente',
    selected: false,
    file: 'plot-area.md'
  }, {
    id: 4,
    title: 'Utilities',
    content: 'not contente',
    selected: false,
    file: 'utilities.md'
  }])


  return (
    <>
      <IconButton
        size='small'
        onClick={handleClickOpen}
        sx={{ ml: 2 }}
        color={'inherit'}
      >
        <HelpIcon fontSize='small' />
      </IconButton>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{ zIndex: ({ zIndex }) => zIndex.tooltip + 1, }}
      >
        <AppBar sx={{ position: 'fixed', zIndex: ({ zIndex }) => zIndex.drawer + 1, w: '35px' }}>
          <StyledToolbar>
            <Typography sx={{ ml: 2, flex: 1, alignSelf: 'center' }} variant="h6" component="div">
              Help
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              size='small'
            >
              <CloseIcon />
            </IconButton>
          </StyledToolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '250px' },
          }}
          open
        >
          <StyledToolbar />
          <ListHelpItems items={items} onChange={handleChange} />
          <Divider />
          <Divider />

        </Drawer>
        <div style={{ marginLeft: 260, marginTop: 40 }}>
          <MdText style mdPath={items.find(f => f.selected).file} />
        </div>
      </Dialog>
    </>
  );
}