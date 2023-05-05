import * as React from 'react'
import List from '@mui/material/List'
import Checkbox from '@mui/material/Checkbox'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import Tooltip from './Tooltip'
import { useData } from '../../hooks/useData'
import { ProcessFile } from '../../interfaces/interfaces'

const FileList = ({ files }: { files: ProcessFile[] }) => {
  const { changeSelectedFile } = useData()

  const handleSelect = (id: number) => {
    changeSelectedFile(id)
  }

  return (
    files &&
    files.length > 0 && (
      <>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', m: 0, p: 0 }}>
          {files?.map(file => {
            const labelId = `checkbox-list-label-${file.name}`
            return (
              <ListItem key={file.id} disablePadding sx={{ padding: 0, margin: 0 }}>
                <Tooltip file={file}>
                  <ListItemButton role={undefined} onClick={() => handleSelect(file.id)} dense>
                    <Checkbox
                      edge='start'
                      checked={file.selected}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                      size='small'
                      sx={{ p: 0, m: 0 }}
                    />
                    <ListItemText id={labelId} style={{ fontSize: 10, margin: 0, padding: 0 }}>
                      <span style={{ fontSize: 12 }}>{file.name}</span>
                    </ListItemText>
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            )
          })}
        </List>
      </>
    )
  )
}
export default FileList
