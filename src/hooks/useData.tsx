import * as React from 'react'
import _ from 'lodash'

import useLocalStorage from './useLocalStorage'
import { GrafContext } from '../context/GraftContext'
import { csvFileColum, IStepBetweenPoints, ProcessFile } from '../interfaces/interfaces'


export const useData = () => {

  const [data, setData] = useLocalStorage<ProcessFile[]>('files', null)
  const { graftState: { fileType, csvFileColum }, setSelectedFile, setSelectedColumns: setColumns } = React.useContext(GrafContext)

  const updateData = (payload: ProcessFile[]) => {
    if (payload?.length > 0) {
      setData(payload)
    } else {
      setData([])
    }
  };

  const changeSelectedFile = (id: number) => {
    const file = data.find((file) => file.id === id)

    if (file.type === 'csv') {
      setSelectedFile('csv')
      setData(prev => prev.map(file => ({ ...file, selected: file.id === id })))

      if (csvFileColum?.length > 0 && _.isEmpty(csvFileColum.find((c) => file.name === c.fileName)))
        setColumns([...csvFileColum, {
          id: file.id,
          fileName: file.name,
          selected: file.selected,
          notSelected: file.csv.columns.map((name, index) => ({
            name,
            index,
          }))
        }])

      else if (csvFileColum?.length === 0)
        setColumns([{
          id: file.id,
          fileName: file.name,
          selected: file.selected,
          notSelected: file.csv.columns.map((name, index) => ({
            name,
            index,
          }))
        }])

      else
        setColumns(csvFileColum.map((c) => ({
          ...c,
          selected: c.fileName === file.name,
        })))

    } else if (file.type === fileType) {
      setData(prev => prev.map(file => file.id === id ? { ...file, selected: !file.selected } : file))

    } else {
      setSelectedFile(file.type)
      setData(prev => prev.map(file => ({ ...file, selected: file.id === id })))
    }
  }

  const getImpedanceData = () => {
    if (data === null) {
      return [];
    }

    return data.filter(file => file.selected).map((file) => (
      {
        ...file,
        content: file.content.map((c) => ([
          parseFloat(c[2]) * Math.cos(parseFloat(c[3]) * Math.PI / 180),
          -parseFloat(c[2]) * Math.sin(parseFloat(c[3]) * Math.PI / 180)
        ])
        )
      }))
  }

  const getModuleFase = () => {
    if (data === null) {
      return null;
    }
    const impedanceData = data.filter(file => file.selected).map((file) => ({
      ...file,
      content: file.content.map((c, i) => (
        {
          module: {
            x: Math.log10(parseFloat(c[1])),
            y: parseFloat(c[2])
          },
          fase: {
            x: Math.log10(parseFloat(c[1])),
            y: -parseFloat(c[3])
          }
        }
      ))
    }))

    return impedanceData
  }

  const calculateColumn = (key: string, value: string[], isImpedance: boolean = true) => {
    const calculate = {
      Time: isImpedance ? parseFloat(value[0]) : value[2],
      Frequency: parseFloat(value[1]),
      Module: parseFloat(value[2]),
      Fase: parseFloat(value[3]),
      ZR: parseFloat(value[2]) * Math.cos(parseFloat(value[3]) * Math.PI / 180),
      ZI: -parseFloat(value[2]) * Math.sin(parseFloat(value[3]) * Math.PI / 180),
      name: '',
      Voltage: value[0],
      Current: value[1],
    }

    return calculate[key]
  }

  const exportImpedanceDataToExcel = (columns: string[]) => {
    if (columns.length > 0) {
      return data?.filter(f => f.selected).map((file, i) => {
        return {
          name: file.name,
          value: file.content.map(c => columns.reduce((acc, curr) => ({ ...acc, [`${curr} (${i + 1})`]: calculateColumn(curr, c) }), {})),
        }
      })
    }
    else {
      return []
    }
  }

  const exportVoltammeterDataToExcel = (columns: string[]) => {
    if (columns.length > 0) {
      return data?.filter(f => f.selected).map((file, i) => {
        return {
          name: file.name,
          value: file.content.map((c, j) => columns.reduce((acc, curr) => ({
            ...acc, [`${curr} (${i + 1})`]: calculateColumn(curr, [...c, ((file.voltammeter.totalTime * 1000 / file.pointNumber) * j).toString()], false)
          }), {})),
        }
      })
    }
    else {
      return []
    }
  }

  const cleanData = () => setData(null)

  const getVCData = (stepBetweens: IStepBetweenPoints) => {
    if (data === null) {
      return [];
    }
    return data.map(file => ({ ...file, content: _.dropRight(file.content) })).filter(file => file.selected).map((file) => (
      {
        ...file,
        content: file.content.filter((c, i) => i % stepBetweens === 0).map((c) => [c[0], c[1]])
      }))
  }

  const getZIZRvsFrequency = () => {
    if (data === null) {
      return [];
    }
    return data.filter(file => file.selected).map((file) => ({
      ...file,
      content: file.content.map((c, i) => (
        {
          Zi: {
            x: Math.log10(parseFloat(c[1])),
            y: -parseFloat(c[2]) * Math.sin(parseFloat(c[3]) * Math.PI / 180)
          },
          Zr: {
            x: Math.log10(parseFloat(c[1])),
            y: parseFloat(c[2]) * Math.cos(parseFloat(c[3]) * Math.PI / 180)
          }
        }
      ))
    }))

  }

  const getCSVData = (cols: csvFileColum) => {
    if (data === null || _.isEmpty(cols)) {
      return [];
    }
    const csvData = data.filter(file => file.selected).find((file) => file.type === 'csv')

    // group columns by axis
    const x = cols?.x
    const y = cols?.y
    const y2 = cols?.y2

    if (_.isEmpty(x) && _.isEmpty(y)) return null

    let currentData

    if (_.isEmpty(x) && _.isEmpty(y)) return null

    currentData = {

      x: x?.map((c) => ({ ...c, content: csvData.content.map((d) => d[c.index]) })),
      y: y?.map((c) => ({ ...c, content: csvData.content.map((d) => d[c.index]) })),
      y2: y2 && y2?.map((c) => ({ ...c, content: csvData.content.map((d) => d[c.index]) }))
    }

    return currentData
  }

  return {
    data,
    updateData,
    cleanData,
    changeSelectedFile,
    getImpedanceData,
    getModuleFase,
    exportImpedanceDataToExcel,
    getVCData,
    getZIZRvsFrequency,
    getCSVData,
    exportVoltammeterDataToExcel
  };
};