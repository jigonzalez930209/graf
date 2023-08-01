import { Chart } from 'chart.js'
import * as React from 'react'
import { useData } from './useData'
import { GrafContext } from '../context/GraftContext'
import _ from 'lodash'

const commonOptions: Chart['options'] = {
  responsive: true,
  layout: {
    autoPadding: true,
  },
  scatter: {
    datasets: {
      showLine: true,
    },
  },
  plugins: {
    legend: {
      position: 'right',
      align: 'start',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        mode: 'xy',
      },
      pan: {
        enabled: true,
      },
    },
  },
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
    },
  },
}

export const useChartData = () => {
  const [data, setData] = React.useState<Chart['data']>(null)
  const [options, setOptions] = React.useState<Chart['options']>(null)
  const {
    graftState: { fileType, graftType, impedanceType, stepBetweenPoints, drawerOpen, csvFileColum },
  } = React.useContext(GrafContext)

  const {
    getImpedanceData,
    getModuleFase,
    getVCData,
    getZIZRvsFrequency,
    getCSVData,
    data: currentData,
  } = useData()

  const dataGSelector = {
    teq4Z: {
      Bode: getImpedanceData(),
      Nyquist: getModuleFase(),
      ZiZrVsFreq: getZIZRvsFrequency(),
    },
    teq4: {
      data: getVCData(stepBetweenPoints),
    },
    csv: {
      data: () => {
        let csvData = getCSVData(csvFileColum?.find(csv => csv.selected && (!!currentData.find(d => d.name === csv.fileName)?.name)))

        if (csvData?.x?.length === 1) {
          setData(_.flatMapDepth(
            csvData?.y.map((d, i) => {
              let values = []
              values.push(
                {
                  x: csvData.x[0].content,
                  y: d.content,
                  type: 'scatter',
                  mode: graftType === 'line' ? 'lines' : 'markers',
                  name: d.name,
                  legendgroup: `${d.name}`,
                  marker: {
                    color: COLORS[i],
                    size: 3
                  },
                  line: {
                    color: COLORS[i],
                    width: 1
                  },
                  color: COLORS[i]
                }
              )
              csvData?.y2[i]?.name && values.push({
                x: csvData.x[0].content,
                y: csvData.y2[i].content,
                type: 'scatter',
                mode: graftType === 'line' ? 'lines' : 'markers',
                name: `y2_${csvData?.y2[i]?.name}`,
                legendgroup: `${csvData.x[0].name}`,
                yaxis: 'y2',
                marker: {
                  color: COLORS[i],
                  size: 3
                },
                line: {
                  color: COLORS[i],
                  width: 1
                },
                color: COLORS[i]
              })

              return values
            })))
      },
    },
  }

  React.useEffect(() => {
    setData(dataGSelector[fileType][fileType === 'teq4Z' ? impedanceType : 'data'])
    setOptions(commonOptions)
  }, [fileType, graftType, impedanceType, stepBetweenPoints])

  return { data, options }
}
