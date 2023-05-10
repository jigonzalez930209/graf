import * as React from 'react'
import _ from 'lodash'
import List from '@mui/material/List'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Checkbox from '@mui/material/Checkbox'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import BlurOnIcon from '@mui/icons-material/BlurOn'
import BlurOffIcon from '@mui/icons-material/BlurOff'
import { IconButton } from '@mui/material'

import Tooltip from './Tooltip'
import { useData } from '../../hooks/useData'
import { ProcessFile } from '../../interfaces/interfaces'

type GroupedFiles = {
  teq4: ProcessFile[]
  teq4Z: ProcessFile[]
  csv: ProcessFile[]
  all: ProcessFile[]
}

const CurrentListItem = ({ file }: { file: ProcessFile }) => {
  const { data, changeSelectedFile } = useData()
  const labelId = `checkbox-list-label-${file.name}`
  return (
    <ListItem key={file.id} disablePadding sx={{ padding: 0, margin: 0 }}>
      <Tooltip file={file}>
        <ListItemButton role={undefined} onClick={() => changeSelectedFile(file.id)} dense>
          <Checkbox
            edge='start'
            checked={data.find(d => d.id === file.id)?.selected === false ? undefined : true}
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
}

type AccordionGroupedFilesProps = {
  title: string
  files: ProcessFile[]
}

const AccordionGroupedFilesItems = ({ title, files }: AccordionGroupedFilesProps) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0, m: 0, pb: 2 }}>
        <List dense sx={{ p: 0, m: 0 }}>
          {files.map(file => (
            <CurrentListItem key={file.id} file={file} />
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  )
}

const AccordionGrouped = ({ all, teq4, teq4Z, csv }: GroupedFiles) => {
  return (
    <div>
      {all.length > 0 && <AccordionGroupedFilesItems title='All Files' files={all} />}
      {teq4.length > 0 && <AccordionGroupedFilesItems title='Teq4 Files' files={teq4} />}
      {teq4Z.length > 0 && <AccordionGroupedFilesItems title='Teq4Z Files' files={teq4Z} />}
      {csv.length > 0 && <AccordionGroupedFilesItems title='CSV Files' files={csv} />}
    </div>
  )
}

const FileList = ({ files }: { files: ProcessFile[] }) => {
  const [groupedFiles, setGroupedFiles] = React.useState({
    teq4: [],
    teq4Z: [],
    csv: [],
    all: files,
  })

  const [groupByType, setGroupByType] = React.useState(false)

  const handleGroupingByType = () => {
    if (!groupByType) {
      setGroupedFiles({
        teq4: files.filter(f => f.type === 'teq4'),
        teq4Z: files.filter(f => f.type === 'teq4Z'),
        csv: files.filter(f => f.type === 'csv'),
        all: [],
      })
      setGroupByType(true)
    } else {
      setGroupedFiles({
        teq4: [],
        teq4Z: [],
        csv: [],
        all: files,
      })
      setGroupByType(false)
    }
  }

  React.useEffect(() => {
    if (!groupByType) {
      setGroupedFiles({
        teq4: [],
        csv: [],
        teq4Z: [],
        all: files,
      })
    }
  }, [files])

  return (
    <>
      <div>
        <IconButton onClick={handleGroupingByType} size='small'>
          {groupByType ? <BlurOffIcon /> : <BlurOnIcon />}
        </IconButton>
      </div>
      <AccordionGrouped
        all={groupedFiles.all}
        csv={groupedFiles.csv}
        teq4={groupedFiles.teq4}
        teq4Z={groupedFiles.teq4Z}
      />
    </>
  )
}
export default FileList
