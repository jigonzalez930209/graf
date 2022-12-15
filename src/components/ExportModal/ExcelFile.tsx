import * as React from 'react'
import { useExcelDownloder } from 'react-xls';
import { GrafContext } from '../../context/GraftContext';
import { useData } from '../../hooks/useData';

type ExcelFileExportProps = {
  columns: string[],
  isSameSheet: boolean,
  children: React.ReactNode
  filename: string
}

const ExcelFileExport = ({ columns, isSameSheet, filename }: ExcelFileExportProps) => {
  const { exportImpedanceDataToExcel } = useData()
  const data = exportImpedanceDataToExcel(columns)
  const { graftState: { fileType } } = React.useContext(GrafContext);

  const { ExcelDownloder, Type } = useExcelDownloder();

  if (fileType === 'teq4Z') {
    if (isSameSheet) {
      return (
        <div>
          <ExcelDownloder
            data={{
              data:
                [
                  ...data[0].value.map((_, i) => ({
                    ...data.reduce((acc, curr) => ({ ...acc, [curr.name]: '', ...curr.value[i] }), {})
                  }))
                ]
            }}
            filename={filename}
            type={Type.Button}
          >
            Download
          </ExcelDownloder>
        </div>
      )
    } else {
      return (
        <div>
          <ExcelDownloder
            data={{
              ...data.reduce((acc, curr) => ({ ...acc, [curr.name.slice(0, 25)]: curr.value }), {})
            }}
            filename={filename}
            type={Type.Button}
          >
            Download
          </ExcelDownloder>
        </div>
      )
    }
  }
  else {
    return null
  }
}

export default ExcelFileExport