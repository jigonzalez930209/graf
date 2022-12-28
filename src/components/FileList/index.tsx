import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { Tooltip } from '@mui/material';

import { ProcessFile, useData } from '../../hooks/useData';

const FileList = ({ files }: { files: ProcessFile[] }) => {
  const { changeSelectedFile } = useData()
  return (files && files.length > 0) && (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {files?.map((file, i) => {

        const labelId = `checkbox-list-label-${file.name}`;

        return (
          <ListItem
            key={file.id}
            disablePadding
          >
            <Tooltip
              placement="right"
              arrow
              title={
                <>
                  {file.type === 'teq4' && (
                    <React.Fragment>
                      <Typography variant='h6'>Cyclic voltametry</Typography>
                      <p>Cycles: {file.voltammeter?.cicles}</p>
                      <p>Samples by second: {file.voltammeter?.samplesSec} samples/s</p>
                      <p>Total Time: {file.voltammeter?.totalTime} s</p>
                      <p>Total Points: {file.content?.length}</p>
                    </React.Fragment>
                  )} {file.type === 'teq4Z' && (
                    <React.Fragment>
                      <Typography variant='h6'>Impedance</Typography>
                      <p>Voltage: {file.impedance?.V} V</p>
                      <p>Sinusoidal Amplitude: {file.impedance?.signalAmplitude} V</p>
                      <p>Initial Frequency: {file.impedance?.sFrequency} Hz</p>
                      <p>End Frequency: {file.impedance?.eFrequency} Hz</p>
                      <p>Total Points: {file.impedance?.totalPoints}</p>
                    </React.Fragment>
                  )}
                </>
              }
            >
              <ListItemButton role={undefined} onClick={() => changeSelectedFile(file.id)} dense>
                <Checkbox
                  edge="start"
                  checked={file.selected}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
                <ListItemText id={labelId} style={{ fontSize: 10, margin: 0, padding: 0 }} primary={file.name} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>
  );
}
export default FileList