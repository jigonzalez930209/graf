import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

import { ProcessFile, useData } from '../../hooks/useData';

const FileList: React.FC<{ files: ProcessFile[] }> = ({ files }) => {
  const { changeSelectedFile } = useData()
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {files?.map((file) => {

        const labelId = `checkbox-list-label-${file.name}`;

        return (
          <ListItem
            key={file.id}
            disablePadding
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
          </ListItem>
        );
      })}
    </List>
  );
}
export default FileList