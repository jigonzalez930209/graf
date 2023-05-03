import * as React from 'react';
import { FormControl, IconButton, InputLabel, MenuItem, Paper, Popover, Popper, Select, Box, Grid, Typography, Slider } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

import { IGraftImpedanceType, IGrafType } from "../../interfaces/interfaces";
import { GrafContext } from '../../context/GraftContext';
import Tooltip from '../Tooltip';
import { rotate } from '../../utils';


const GraftHandlerPopper = () => {
  const {
    setGraftType,
    setImpedanceType,
    setStepBetweenPoints,
    graftState: {
      graftType,
      fileType,
      impedanceType,
      stepBetweenPoints,
    }
  } = React.useContext(GrafContext);

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'popper' : undefined;

  const handleSliderChange = (event: Event, newValue: number) => {
    setStepBetweenPoints(newValue);
  };

  return (
    <>
      <Tooltip title="Current settings" placement="bottom">
        <IconButton
          aria-describedby={id}
          size="small"
          color="inherit"
          sx={{
            ml: 2,
            ...(open && rotate)
          }}
          onMouseEnter={handleClick}
        >
          <SettingsIcon fontSize='inherit' />
        </IconButton>
      </Tooltip>
      <Popover
        id={id}
        sx={{ minWidth: 420, minHeight: 250 }}
        open={canBeOpen}
        anchorEl={anchorEl}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Paper
          onMouseLeave={() => setOpen(false)}
          sx={{
            p: 1,
            width: 350,
            height: 180
          }}>
          <Grid container>
            <Grid item>
              <FormControl variant="filled" sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="type">Type</InputLabel>
                <Select
                  labelId="type"
                  id="graftType"
                  value={graftType}
                  onChange={(e) => {
                    setOpen(false)
                    setGraftType(e.target.value as IGrafType)
                  }}
                  defaultValue='line'
                >
                  <MenuItem value='line'>Line</MenuItem>
                  <MenuItem value='scatter'>Scatter</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {fileType === 'teq4Z' &&
              <Grid item>
                <FormControl variant="filled" sx={{ m: 1 }}>
                  <InputLabel id="impedance-type">Impedance type</InputLabel>
                  <Select
                    labelId="impedance-type"
                    id="graftType"
                    value={impedanceType}
                    onChange={(e) => {
                      setOpen(false)
                      setImpedanceType(e.target.value as IGraftImpedanceType)
                    }}
                    defaultValue='Nyquist'
                  >
                    <MenuItem value='Nyquist'>Nyquist</MenuItem>
                    <MenuItem value='Bode'>Bode</MenuItem>
                    <MenuItem value='ZiZrVsFreq'>ZiZrVsFreq</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            }
            {fileType === 'teq4' && (<Grid item>
              <FormControl variant="filled" sx={{ m: 1, maxHeight: 20 }}>
                <Box sx={{ maxWidth: 250 }}>
                  <Typography id="input-slider" gutterBottom>
                    Steps between points
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Slider
                        value={typeof stepBetweenPoints === 'number' ? stepBetweenPoints : 1}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        min={1}
                        max={30}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" sx={{ width: 42 }}>
                        {stepBetweenPoints}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            </Grid>)}
          </Grid>
        </Paper>
      </Popover>
    </>
  )
}

export default GraftHandlerPopper;