import * as React from 'react';
import { Box } from '@mui/system';
import { FormControl, IconButton, InputLabel, MenuItem, Paper, Popover, Select } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

import { IGraftImpedanceType, IGrafType } from "../../interfaces/interfaces";
import { GrafContext } from '../../context/GraftContext';


const GraftHandlerPopper = () => {
  const { setGraftType, setImpedanceType, graftState: { graftType, fileType } } = React.useContext(GrafContext);

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'popper' : undefined;

  return (
    <>
      <IconButton
        aria-describedby={id}
        size="large"
        color="inherit"
        sx={{ ml: 2 }}
        onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
      <Popover
        id={id}
        open={canBeOpen}
        anchorEl={anchorEl}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Paper sx={{ p: 1, bgcolor: 'background.paper', w: 25, h: 300 }}>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 150, maxHeight: 20 }}>
            <InputLabel id="type">Type</InputLabel>
            <Select
              labelId="type"
              id="graftType"
              value={graftType}
              onChange={(e) => setGraftType(e.target.value as IGrafType)}
              defaultValue='line'
            >
              <MenuItem value='line'>Line</MenuItem>
              <MenuItem value='scatter'>Scatter</MenuItem>
            </Select>
          </FormControl>
          {fileType === 'teq4Z' && <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="impedance-type">Impedance type</InputLabel>
            <Select
              labelId="impedance-type"
              id="graftType"
              value={graftType}
              onChange={(e) => setImpedanceType(e.target.value as IGraftImpedanceType)}
              defaultValue='Nyquist'
            >
              <MenuItem value='Nyquist'>Nyquist</MenuItem>
              <MenuItem value='Bode' disabled>Bode</MenuItem>
              <MenuItem value='ZiZrVsFreq' disabled>ZiZrVsFreq</MenuItem>
            </Select>
          </FormControl>}
        </Paper>
      </Popover>
    </>
  )
}

export default GraftHandlerPopper;