import * as React from 'react'
import _ from 'lodash'

import useLocalStorage from './useLocalStorage'
import { GrafContext } from '../context/GraftContext'
import { IStepBetweenPoints } from '../interfaces/interfaces'

export type File = {
  id: number
  name: string
  content: string
  selected: boolean
}

export type ExportData = {
  name: string
  value: {
    Time?: number,
    Frequency?: number,
    Module?: number,
    Fase?: number,
    ZI?: number,
    ZR?: number,
  }[]
}[]

export type ProcessFile = {
  id: number
  name: string
  type: 'teq4' | 'teq4Z'
  pointNumber: number
  content: string[][]
  selected: boolean
}

export type Files = {
  files: File[]
}


export const useData = () => {

  const [data, setData] = useLocalStorage<ProcessFile[]>('files', null)
  const { graftState: { fileType }, setSelectedFile } = React.useContext(GrafContext)


  const updateData = (payload: ProcessFile[]) => {
    if (payload?.length > 0) {
      setData(payload)
    } else {
      setData([])
    }
  };

  const changeSelectedFile = (id: number) => {
    const file = data.find((file) => file.id === id)
    if (file.type === fileType) {
      setData(prev => prev.map(file => {
        return file.id === id ? { ...file, selected: !file.selected } : file
      }))
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
        content: file.content.map((c) => {
          const y = -parseFloat(c[2]) * Math.sin(parseFloat(c[3]) * Math.PI / 180)
          const x = parseFloat(c[2]) * Math.cos(parseFloat(c[3]) * Math.PI / 180)
          return [x, y]
        })
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

  const calculateColumn = (key: string, value: string[]) => {
    const calculate = {
      Time: parseFloat(value[0]),
      Frequency: parseFloat(value[1]),
      Module: parseFloat(value[2]),
      Fase: parseFloat(value[3]),
      ZR: parseFloat(value[2]) * Math.cos(parseFloat(value[3]) * Math.PI / 180),
      ZI: -parseFloat(value[2]) * Math.sin(parseFloat(value[3]) * Math.PI / 180),
      name: ''
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

  return {
    data,
    updateData,
    cleanData,
    changeSelectedFile,
    getImpedanceData,
    getModuleFase,
    exportImpedanceDataToExcel,
    getVCData,
    getZIZRvsFrequency
  };
};