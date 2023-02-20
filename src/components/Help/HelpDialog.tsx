import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import HelpIcon from '@mui/icons-material/Help';
import { Dialog, Divider, AppBar, Toolbar, IconButton, Typography, Slide, Drawer } from '@mui/material';
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
    minHeight: 35,
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
  },
    // {
    //   id: 2,
    //   title: 'File Handler',
    //   content: 'not contente',
    //   selected: false,
    //   file: 'file-handler.md'
    // }, {
    //   id: 3,
    //   title: 'Plot Area',
    //   content: 'not contente',
    //   selected: false,
    //   file: 'plot-area.md'
    // }, {
    //   id: 4,
    //   title: 'Utilities',
    //   content: 'not contente',
    //   selected: false,
    //   file: 'utilities.md',
    // }
  ])


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
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, minHeight: 35 }}>
          <Toolbar sx={{
            paddingTop: 0,
            paddingBottom: 0,
            '@media all': {
              minHeight: 35,
            }
          }}
          >
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
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '250px' }
          }}
          open
        >
          <ListHelpItems items={items} onChange={handleChange} />
          <Divider />
          <Divider />

        </Drawer>
        <div style={{ marginLeft: 260, marginTop: 40, marginBottom: 20 }}>
          <MdText style mdPath={items.find(f => f.selected).file} />
        </div>
      </Dialog>
    </>
  );
}