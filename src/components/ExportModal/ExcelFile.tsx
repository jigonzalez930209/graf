import _ from 'lodash';
import * as React from 'react'
import ReactExport from "react-export-excel-xlsx-fix";
import { GrafContext } from '../../context/GraftContext';
import { useData } from '../../hooks/useData';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

type ExcelFileExportProps = {
  columns: string[],
  isSameSheet: boolean,
  children: React.ReactNode
  filename: string
}

const ExcelFileExport = ({ children, columns, isSameSheet, filename }: ExcelFileExportProps) => {
  const { exportImpedanceDataToExcel } = useData()
  const data = exportImpedanceDataToExcel(columns)
  const { graftState: { fileType } } = React.useContext(GrafContext);

  if (fileType === 'teq4Z') {
    if (isSameSheet) {
      const customData = [
        {
          columns: [
            ...data.reduce((acc, curr) =>
              ([...acc, { value: curr.name }, ...Object.keys(curr.value[0]).map(d => ({ value: d }))]), []
            )
          ],
          data: [
            ...data[0].value.map((_, i) => (
              [
                ...data.reduce((acc, curr) =>
                  ([...acc, { value: '', style: { background: 'black' } }, ...Object.values(curr.value[i]).map(d => ({ value: d.toString() }))]), []
                )
              ]
            ))
          ]
        }
      ]
      return data?.length > 0 && (
        <ExcelFile filename={filename} element={children} >
          <ExcelSheet dataSet={customData} name='Impedance'>
          </ExcelSheet>
        </ExcelFile>
      )
    } else {
      return data?.length > 0 && (
        <ExcelFile filename={filename} element={children} >
          {
            data.map(file => (
              <ExcelSheet key={`${file.name}${_.random()}`} data={file.value} name={file.name.slice(0, 30)}>
                {Object.keys(file.value[1]).map(d => {
                  return (<ExcelColumn key={`${file.name}${d}`} label={d} value={d} />)
                })}
              </ExcelSheet>
            ))
          }
        </ExcelFile>
      )
    }
  }
  else return null

}

export default ExcelFileExport