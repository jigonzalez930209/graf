import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

type TableProps = {
  header: string[]
  data: string[][]
}

const DenseTable: React.FC<TableProps> = ({ header, data }) => {

  return (
    <TableContainer style={{
      backgroundColor: 'transparent',
      color: 'white'
    }}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {header.map((cell, i) =>
              <TableCell key={cell + i} style={{ color: 'wheat' }} align="center">{cell}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={`row-${i}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {row.map((cell, j) =>
                <TableCell key={`cell-${i}-${j}`} style={{ color: 'wheat' }} component="th" scope="row">
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