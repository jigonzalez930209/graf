import * as React from 'react'
import _ from 'lodash'

import useLocalStorage from './useLocalStorage'
import { GrafContext } from '../context/GraftContext'

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

    return data.map(file => ({ ...file, content: _.dropRight(file.content) })).filter(file => file.selected).map((file) => (
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
    let minY, minX = 500000000
    let maxY, maxX = -500000000
    const impedanceCorrectionData = data.map(file => ({ ...file, content: _.dropRight(file.content) }))
    const impedanceData = impedanceCorrectionData.filter(file => file.selected).map((file) => (
      {
        ...file,
        content: file.content.map((c, i) => {
          const module = parseFloat(c[2])
          const fase = -parseFloat(c[3])
          const x = file.pointNumber - i // parseFloat(c[1])
          minX = _.min([x, minX])
          maxX = _.max([x, maxX])
          minY = _.min([_.min([module, fase]), minY])
          maxY = _.max([_.max([module, fase]), maxY])
          return {
            module: {
              x,
              y: module
            },
            fase: {
              x,
              y: fase
            }
          }
        })
      }))

    return {
      yExtremes: [minY + minY * .1, maxY + maxY * .1],
      xExtremes: [minX + minX * .1, maxX + maxX * .1],
      data: impedanceData,
    }
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
          value: file.content.map(c => columns.reduce((acc, curr) => ({ ...acc, [`${curr}${i + 1}`]: calculateColumn(curr, c) }), {})),
        }
      })
    }
    else {
      return []
    }
  }

  const cleanData = () => setData(null)

  const getVCData = ({ eliminateInnerPoints }: { eliminateInnerPoints: number }) => {
    if (data === null) {
      return [];
    }
    return data.map(file => ({ ...file, content: _.dropRight(file.content) })).filter(file => file.selected).map((file) => (
      {
        ...file,
        content: file.content.filter((c, i) => i % eliminateInnerPoints === 0).map((c) => [c[0], c[1]])
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
    getVCData
  };
};