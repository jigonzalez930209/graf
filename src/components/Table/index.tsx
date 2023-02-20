import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Radio, Box } from '@mui/material';
import { ProcessFile } from '../../interfaces/interfaces';

type TableProps = {
  header: string[]
  file: ProcessFile
  truncateIn?: number
  onSelectChange: (row: number) => void
}

const DenseTable: React.FC<TableProps> = ({ header, file, truncateIn = 50, onSelectChange }) => {
  const [selectedValue, setSelectedValue] = React.useState(file.selectedInvariableContentIndex);
  const [currentData, setCurrentData] = React.useState(null)

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(parseInt(event.target.value));

    onSelectChange(parseInt(event.target.value))
  }

  React.useEffect(() => {
    setCurrentData(file.invariableContent.slice(0, truncateIn))
    onSelectChange(selectedValue)
  }, [truncateIn])

  return (
    <TableContainer style={{
      backgroundColor: 'transparent',
      color: 'white'
    }}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        {header?.length > 0 && <TableHead>
          <TableRow>
            {header.map((cell, i) =>
              <TableCell key={cell + i} style={{ color: 'wheat' }} align="center">{cell}</TableCell>
            )}
          </TableRow>
        </TableHead>}
        <TableBody>
          {currentData?.map((row, i) => (
            <TableRow
              key={`row-${i}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell
                padding='none'
                size='small'
                align='left'
                sx={{
                  p: 0,
                  width: 100,
                }} component="th" scope="row">
                <Box sx={{ p: 0, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                  {i + 1}
                  <Radio
                    checked={selectedValue === i}
                    onChange={handleSelect}
                    value={i}
                    name="radio-buttons"
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 15,
                      },
                    }}
                  />
                </Box>

              </TableCell>
              {row.map((cell, j) =>
                <TableCell key={`cell-${i}-${j}`} sx={{ color: them => them.palette.grey[700] }} component="th" scope="row">
                  {cell}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DenseTable