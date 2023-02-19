import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSnackbar } from 'notistack';
import _ from 'lodash';

import DenseTable from '../Table';
import { useData } from '../../hooks/useData';
import { ProcessFile } from '../../interfaces/interfaces';

type DataSelectorProps = {
  file: ProcessFile,
  open: boolean,
  onClose: () => void,
}

const DataSelectorDialog = ({ file, open, onClose }: DataSelectorProps) => {

  const { data: savedData, updateFileContent } = useData();
  const [selectedRow, setSelectedRow] = React.useState(0)
  const { enqueueSnackbar } = useSnackbar()

  const handleClose = () => {
    onClose();
  };
  const handleChange = (row: number) => {
    setSelectedRow(row)
  }

  const handleSave = async () => {
    if (selectedRow < 0) {
      enqueueSnackbar('The selected row is equal to default value', { variant: 'error' })
      return
    }
    await updateFileContent({
      id: file.id,
      newSelectedIndex: selectedRow,
      fileName: savedData.find(d => d.selected).name,
    })
    onClose();
  }

  return (
    <React.Fragment>
      <Dialog
        fullWidth={false}
        maxWidth='lg'
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Data selector file: {file?.name}</DialogTitle>
        <DialogContent sx={{ position: 'relative' }}>
          <Box sx={{ position: 'static ', backgroundColor: (t) => t.palette.error.dark, width: '100%', borderRadius: 2, px: 1, color: (t) => t.palette.getContrastText(t.palette.error.dark) }}>
            Select where is columns name row and where is data start row.{' '}
            <b>By default, the algorithm select a row will take the values of the column names.</b>
          </Box>
          <Box sx={{ px: 1 }}>Row selected: {selectedRow + 1} {'   '} Rows inView: {25}</Box>
          <Box
            component="div"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: '100%',
            }}
          >
            <DenseTable truncateIn={25} header={null} file={savedData?.find(d => d.selected)} onSelectChange={handleChange} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button color='primary' variant='contained' onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default DataSelectorDialog;