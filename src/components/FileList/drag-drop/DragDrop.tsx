import _ from 'lodash'
import * as React from 'react'
import { useSnackbar } from 'notistack'
import { Grid, IconButton } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import { GrafContext } from '../../../context/GraftContext'
import Tooltip from '../../Tooltip'

import { arrayMove, insertAtIndex, removeAtIndex } from './utils/array'
import Droppable from './Droppable'
import Item from './Item'
import { useData } from '../../../hooks/useData'

export type droppableItem = {
  index: number
  name: string
}
export type ColumnsGroup = {
  columns: droppableItem[]
  yAxis: droppableItem[]
  xAxis: droppableItem[]
  y2Axis: droppableItem[]
}

const DragDrop = ({ PlotlyChart }: { PlotlyChart: JSX.Element }) => {
  const { data } = useData()
  const {
    graftState: { csvFileColum },
    setSelectedColumns,
  } = React.useContext(GrafContext)

  const { enqueueSnackbar } = useSnackbar()

  const [itemGroups, setItemGroups] = React.useState<ColumnsGroup>({
    columns: [],
    yAxis: [],
    xAxis: [],
    y2Axis: [],
  })
  const [activeId, setActiveId] = React.useState<string>(null)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleApply = () => {
    // not selected any column
    if (_.isEmpty(itemGroups.xAxis) && _.isEmpty(itemGroups.yAxis) && _.isEmpty(itemGroups.y2Axis)) {
      console.warn('No columns selected')
      enqueueSnackbar('No columns selected', { variant: 'error' })
      return
    }

    // not selected a X axis
    if (_.isEmpty(itemGroups.xAxis)) {
      console.warn('X axis is empty')
      enqueueSnackbar('X axis is empty', { variant: 'error' })
      return
    }

    // not selected Y axis and selected Y2 axis
    if (itemGroups.xAxis.length > 0 && itemGroups.yAxis.length === 0 && itemGroups.y2Axis.length > 0) {
      console.warn('Y1 axis is empty and Y2 axis is not empty')
      enqueueSnackbar('Y1 axis is empty and Y2 axis is not empty', { variant: 'error' })
      return
    }

    // Y2 axis have more cols that Y1 Axis
    if (itemGroups.yAxis.length < itemGroups.y2Axis.length) {
      console.warn('Y2 axis should be have maximum the number of column of Y1 Axis')
      enqueueSnackbar('Y2 axis should be have maximum the number of column of Y1 Axis', { variant: 'error' })
      return
    }

    // Y1 axis is empty
    if (itemGroups.yAxis.length === 0) {
      console.warn('Y axis is empty')
      enqueueSnackbar('Y axis is empty', { variant: 'error' })
      return
    }

    // Y1 axis have more cols that X Axis when X axis have more than one column
    if (itemGroups.xAxis.length > 1 && itemGroups.xAxis.length !== itemGroups.yAxis.length) {
      console.warn('Y1 should be have the same number of column of X axis')
      enqueueSnackbar('Y1 should be have the same number of column of X axis', { variant: 'error' })
      return
    }

    // Y2 axis have more cols that X Axis when X axis have more than one column
    if (itemGroups.xAxis.length > 1 && itemGroups.xAxis.length < itemGroups.y2Axis.length) {
      console.warn('Y2 should be at less the same number of column of X axis')
      enqueueSnackbar('Y2 should be at less the same number of column of X axis', { variant: 'error' })
      return
    }

    // One 'x' and various 'y'
    // if (itemGroups.xAxis.length === 1) {

    //   console.log('X axis have only one column the Y1 and Y2 columns could have more than one column');
    //   enqueueSnackbar('X axis have only one column the Y1 and Y2 columns could have more than one column', { variant: 'info', autoHideDuration: 10000 })
    // }

    setSelectedColumns(
      csvFileColum.map(csv =>
        csv.fileName === data.find(d => d.selected).name
          ? {
              ...csv,
              notSelected: itemGroups.columns.map(c => ({
                ...c,
              })),
              x: itemGroups.xAxis.map(x => ({
                ...x,
              })),
              y: itemGroups.yAxis.map(y => ({
                ...y,
              })),
              y2: itemGroups.y2Axis.map(y2 => ({
                ...y2,
              })),
            }
          : csv
      )
    )
    return
  }

  const handleDragStart = ({ active }) => setActiveId(active.id)

  const handleDragCancel = () => setActiveId(null)

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      setActiveId(null)
      return
    }

    try {
      if (active.id !== over.id) {
        const activeContainer = active.data.current.sortable.containerId
        const overContainer = over.data.current?.sortable.containerId || over.id
        const activeIndex = active.data.current.sortable.index
        const overIndex =
          over.id in itemGroups ? itemGroups[overContainer].length + 1 : over.data.current.sortable.index
        setItemGroups(itemGroups => {
          let newItems
          if (activeContainer === overContainer) {
            newItems = {
              ...itemGroups,
              [overContainer]: arrayMove(itemGroups[overContainer], activeIndex, overIndex),
            }
          } else {
            newItems = moveBetweenContainers(
              itemGroups,
              activeContainer,
              activeIndex,
              overContainer,
              overIndex,
              { index: active.data.current.index, name: active.data.current.name }
            )
          }
          return newItems
        })
      }
    } catch (e) {
      return
    } finally {
      setActiveId(null)
    }
  }

  const moveBetweenContainers = (
    items: ColumnsGroup,
    activeContainer: string,
    activeIndex: number,
    overContainer: string,
    overIndex: number,
    item: droppableItem
  ) => {
    return {
      ...items,
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, item),
    }
  }

  React.useEffect(() => {
    const fileColumns = csvFileColum?.find(c => c.selected)
    setItemGroups({
      columns: [],
      xAxis: [],
      yAxis: [],
      y2Axis: [],
    })

    if (!_.isEmpty(fileColumns)) {
      setTimeout(() => {
        setItemGroups({
          columns: fileColumns.notSelected || [],
          xAxis: fileColumns.x?.map(d => ({ name: d.name, index: d.index })) || [],
          yAxis: fileColumns.y?.map(d => ({ name: d.name, index: d.index })) || [],
          y2Axis: fileColumns.y2?.map(d => ({ name: d.name, index: d.index })) || [],
        })
      }, 1)
    } else {
      setItemGroups({
        columns: [],
        xAxis: [],
        yAxis: [],
        y2Axis: [],
      })
    }
  }, [csvFileColum])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <Tooltip title={'Apply changes'}>
        <IconButton
          sx={{
            'position': 'absolute',
            'bottom': 20,
            'right': 20,
            'backgroundColor': theme => theme.palette.grey[200],
            '&:hover': {
              backgroundColor: theme => theme.palette.grey[300],
            },
            'opacity': 1,
            'zIndex': theme => theme.zIndex.drawer * 10,
          }}
          size='small'
          onClick={handleApply}
        >
          <DoneAllIcon fontSize='inherit' color='success' />
        </IconButton>
      </Tooltip>
      <Grid display='flex'>
        <Droppable
          id='columns'
          items={itemGroups['columns'].length > 0 ? itemGroups['columns'] : []}
          name='Columns'
          isNotIndex
        />
        <Grid
          sx={{
            margin: 0,
            padding: 0,
          }}
        >
          <Droppable id='xAxis' items={itemGroups['xAxis']} name='X' isHorizontal />
          <Droppable id='yAxis' items={itemGroups['yAxis']} name='Y' isHorizontal />
          <Droppable id='y2Axis' items={itemGroups['y2Axis']} name='Y2' isHorizontal />
          {PlotlyChart}
        </Grid>
      </Grid>
      <DragOverlay>
        {activeId ? <Item item={{ name: activeId, index: null }} isNotIndex index={0} dragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default DragDrop
