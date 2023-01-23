import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSnackbar } from 'notistack';
import _ from 'lodash';

import { GrafContext } from '../../context/GraftContext';

import DragDrop, { ColumnsGroup } from './drag-drop/DragDrop';

type ColumnsDialogProp = {
  open: boolean,
  setOpen: (open: boolean) => void
}

const ColumnsDialog = ({ open, setOpen }: ColumnsDialogProp) => {
  const { graftState: { csvFileColum }, setSelectedColumns } = React.useContext(GrafContext)
  const { enqueueSnackbar } = useSnackbar()

  const [currentColumns, setCurrentColumns] = React.useState<ColumnsGroup>(null)

  const onDragChange = (columns: ColumnsGroup) => {
    setCurrentColumns(columns)
  }

  const handleClose = () => {
    setOpen(false);
    csvFileColum && setSelectedColumns(csvFileColum)
  };

  const handleApply = () => {

    if (_.isEmpty(currentColumns.xAxis) && _.isEmpty(currentColumns.yAxis) && _.isEmpty(currentColumns.y2Axis)) {
      console.warn('No columns selected');
      enqueueSnackbar('No columns selected', { variant: 'error' })
      return;
    }

    if (currentColumns.xAxis.length === 1) {
      console.log('X axis have only one column the Y1 and Y2 columns could have more than one column');
      enqueueSnackbar('X axis have only one column the Y1 and Y2 columns could have more than one column', { variant: 'info', autoHideDuration: 10000 })
    }

    if (currentColumns.xAxis.length > 1 && currentColumns.xAxis.length < currentColumns.yAxis.length) {
      console.warn('Y1 should be have maximum the number of column of x Axis');
      enqueueSnackbar('Y1 should be have maximum the number of column of x Axis', { variant: 'error' })
      return;
    }

    if (currentColumns.xAxis.length > 1 && currentColumns.xAxis.length < currentColumns.y2Axis.length) {
      console.warn('Y2 should be have maximum the number of column of x Axis');
      enqueueSnackbar('Y2 should be have maximum the number of column of x Axis', { variant: 'error' })
      return;
    }

    // One 'x' and various 'y'
    if (currentColumns.xAxis.length === 1 && currentColumns.xAxis.length <= currentColumns.yAxis.length) {

      setSelectedColumns({
        ...csvFileColum,
        columns: csvFileColum.columns.map((column) => {
          const axis = currentColumns.xAxis.includes(column.name) && 'xaxis' || currentColumns.yAxis.includes(column.name) && 'yaxis' || currentColumns.y2Axis.includes(column.name) && 'yaxis2' || null
          let axisGroup = !!axis ? 'oneX' : null
          return {
            ...column,
            axis,
            axisGroup,
          }
        }),

      })
      setOpen(false);
      return;
    }

    setSelectedColumns({
      ...csvFileColum,
      columns: csvFileColum.columns.map((column) => {
        const axis = currentColumns.xAxis.includes(column.name) && 'xaxis' || currentColumns.yAxis.includes(column.name) && 'yaxis' || currentColumns.y2Axis.includes(column.name) && 'yaxis2' || null
        let axisGroup
        if (axis === null) {
          axisGroup = null
        } else {
          axisGroup = () => {
            switch (axis) {
              case 'xaxis':
                return _.findIndex(currentColumns.xAxis, (name) => name === column.name)
              case 'yaxis':
                return _.findIndex(currentColumns.yAxis, (name) => name === column.name)
              case 'yaxis2':
                return _.findIndex(currentColumns.y2Axis, (name) => name === column.name)
              default:
                return null
            }
          }
        }

        return {
          ...column,
          axis,
          axisGroup: axisGroup && axisGroup(),
        }
      }),

    })

    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      maxWidth='lg'
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Drag and Drop columns in axis
      </DialogTitle>
      <DialogContent sx={{ width: '100hv', height: '80hv', margin: 0, padding: 0 }}>

        <DragDrop onChange={onDragChange} />

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleApply} autoFocus>
          Apply
        </Button>
      </DialogActions>
    </Dialog >
  );
}

export default ColumnsDialog;