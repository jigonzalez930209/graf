import * as React from 'react'
import { EChartsOption } from 'echarts'

import { useData } from './useData'
import { IGraftData } from '../interfaces/interfaces'
import { GrafContext } from '../context/GraftContext'

type useCharOptionsProps = {
  type: IGraftData,
  title: string
}

const useCharOptions = ({ type, title }: useCharOptionsProps) => {
  const { getImpedanceData, getModuleFase, getVCData } = useData()
  const { graftState: { loading, graftType, fileType } } = React.useContext(GrafContext)

  const impedance = fileType === 'teq4' ? getVCData({ eliminateInnerPoints: 10 }) : getImpedanceData()

  const data = React.useMemo(() => {

  }, [type])


  const options: EChartsOption = {
    tooltip: {
      // trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    dataset: [
      ...impedance?.map(file => ({
        id: file.id,
        name: file.name,
        source: file.content,
      })),
    ],
    stateAnimation: {
      duration: 0,
      easing: 'linear'
    },
    legend: {
      data: [...impedance?.map(file => file.name)],
      orient: "vertical",
      right: 0,
      top: "8%",
      width: "10%",
      height: "50%",
      type: 'scroll',
      textStyle: {
        width: 150,
        color: "#000",
        overflow: 'truncate'
      },
    },
    title: {
      left: 'start',
      text: title
    },
    grid: {
      left: '3%',
      right: '17%',
      bottom: '10%',
      containLabel: true
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'all',
        },
        dataView: { readOnly: false },
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'value',
    },
    dataZoom:
      [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100
        },
        {
          type: 'slider',
          show: true,
          yAxisIndex: [0],
          left: '83.5%',
          start: 0,
          end: 100
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 0,
          end: 100
        },
        {
          type: 'inside',
          yAxisIndex: [0],
          start: 0,
          end: 100
        }
      ],
    // {
    //   id: 'dataZoomX',
    //   type: 'slider',
    //   xAxisIndex: [0],
    //   filterMode: 'none',
    //   start: 0,
    //   end: 100,
    // }
    // ,
    series:
      impedance?.map(file => (
        {
          datasetIndex: file.id,
          name: file.name,
          // type: '',
          silent: true,
          symbolSize: 'line' ? 3 : 5,
          animation: false,
          progressive: 0,  // Important for performance
          smooth: true,
          emphasis: {
            scale: true,
          }
        })),
  }
  console.log({ options })
  return { options, loading }
}

export default useCharOptions