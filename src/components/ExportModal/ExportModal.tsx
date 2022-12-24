import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import { FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Switch, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { COLUMNS_IMPEDANCE, COLUMNS_VOLTAMETER } from '../../utils/utils';
import _ from 'lodash';
import ExcelFileExport from './ExcelFile';
import { GrafContext } from '../../context/GraftContext';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: 3,
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#137cbd',
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#106ba3',
  },
});

function BpCheckbox(props: CheckboxProps) {
  return (
    <Checkbox
      sx={{
        '&:hover': { bgcolor: 'transparent' },
      }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      inputProps={{ 'aria-label': 'Checkbox demo' }}
      {...props}
    />
  );
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
        <div >
          {children}
        </div>
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              ml: 1,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </div>
    </DialogTitle>
  );
}

type ExportModalProps = {
  open: boolean
  onClose: () => void
}

const ExportModal: React.FC<ExportModalProps> = ({ open, onClose }) => {
  const { graftState: { fileType } } = React.useContext(GrafContext)
  const [state, setState] = React.useState(
    fileType === 'teq4Z' ? COLUMNS_IMPEDANCE.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}) : COLUMNS_VOLTAMETER.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
  );

  const [isSameSheet, setIsSameSheet] = React.useState(true)
  const [filename, setFilename] = React.useState(Date.now().toString())

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => setIsSameSheet(event.target.checked)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const error = !Object.values(state).find(c => c === true) || filename === '' || !Boolean(filename.match(/^[]{4,}/))

  const handleClose = () => {
    onClose();
  };

  React.useEffect(() => {
    return () => {
      setFilename('')
      setState(
        fileType === 'teq4Z' ? COLUMNS_IMPEDANCE.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}) : COLUMNS_VOLTAMETER.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
      )
      console.log('unmount')
    }
  }, [open])

  return (open &&
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth='lg'
        sx={{ minWidth: 450 }}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Select a columns to export
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
              <FormLabel component="legend">Select columns to save</FormLabel>
              <FormGroup>
                {fileType === 'teq4Z' && COLUMNS_IMPEDANCE.map(column => <FormControlLabel
                  control={
                    <BpCheckbox checked={state[column]} onChange={handleChange} name={column} />
                  }
                  key={column}
                  label={column}
                />)}
                {fileType === 'teq4' && COLUMNS_VOLTAMETER.map(column => <FormControlLabel
                  control={
                    <BpCheckbox checked={state[column]} onChange={handleChange} name={column} />
                  }
                  key={column}
                  label={column}
                />)}
              </FormGroup>
            </FormControl>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
              <FormLabel component="legend">In the same Sheet</FormLabel>
              <FormGroup>
                <Switch checked={isSameSheet} onChange={handleSwitchChange} name="checkedB" />
              </FormGroup>
            </FormControl>
          </Box>
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormLabel component="legend">File Name</FormLabel>
            <FormGroup>
              <TextField sx={{ width: '100%' }} value={filename} error={!Boolean(filename.length > 4)} onChange={e => setFilename(e.target.value)} name="filename" />
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ height: '3.5rem' }}>
          <ExcelFileExport filename={filename} isSameSheet={isSameSheet} columns={Object.entries(state).filter(([k, v], _) => v === true).map(([k, v]) => k)} >
          </ExcelFileExport>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default ExportModal