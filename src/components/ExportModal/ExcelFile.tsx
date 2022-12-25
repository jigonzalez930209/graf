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
  const { exportImpedanceDataToExcel, exportVoltammeterDataToExcel } = useData()
  const { graftState: { fileType } } = React.useContext(GrafContext);
  const data = fileType === 'teq4Z' ? exportImpedanceDataToExcel(columns) : exportVoltammeterDataToExcel(columns)
  const { ExcelDownloder, Type } = useExcelDownloder();

  const [component, setComponent] = React.useState(<div></div>)


  React.useEffect(() => {
    if (fileType === 'teq4Z') {
      if (isSameSheet) {
        setComponent(() =>
          <div>
            <ExcelDownloder
              data={{
                data:
                  [
                    ...data[0].value.map((_, i) => ({
                      ...data.reduce((acc, curr) => ({
                        ...acc,
                        [`${curr.name} (${i + 1})`]: '',
                        ...curr.value[i]
                      }), {})
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
        setComponent(() =>
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
      setComponent(() => <div>
        <ExcelDownloder
          data={{
            data:
              [
                ...data[0].value.map((_, i) => ({
                  ...data.reduce((acc, curr, j) => ({
                    ...acc,
                    [`${curr.name} (${j + 1})`]: '',
                    ...curr.value[i]
                  }), {})
                }))
              ]
          }}
          filename={filename}
          type={Type.Button}
        >
          Download
        </ExcelDownloder>
      </div>)
    }

    return () => {
      setComponent(<div></div>)
      console.log('set downloaded component to null')
    }

  }, [columns, isSameSheet, filename])
  return component
}

export default ExcelFileExport