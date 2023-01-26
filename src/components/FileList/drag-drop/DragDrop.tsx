import * as  React from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Grid, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import _ from "lodash";

import { GrafContext } from "../../../context/GraftContext";
import Tooltip from "../../Tooltip";

import { arrayMove, insertAtIndex, removeAtIndex } from "./utils/array";
import Droppable from "./Droppable";
import Item from "./Item";

export type ColumnsGroup = {
  columns: string[]
  yAxis: string[]
  xAxis: string[]
  y2Axis: string[]
}

const DragDrop = ({ PlotlyChart }: { PlotlyChart: JSX.Element }) => {

  const { graftState: { csvFileColum }, setSelectedColumns } = React.useContext(GrafContext);

  const { enqueueSnackbar } = useSnackbar()

  const [itemGroups, setItemGroups] = React.useState<ColumnsGroup>({
    columns: [],
    yAxis: [],
    xAxis: [],
    y2Axis: [],
  });
  const [activeId, setActiveId] = React.useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleApply = () => {

    // not selected any column
    if (_.isEmpty(itemGroups.xAxis) && _.isEmpty(itemGroups.yAxis) && _.isEmpty(itemGroups.y2Axis)) {
      console.warn('No columns selected');
      enqueueSnackbar('No columns selected', { variant: 'error' })
      return;
    }

    // not selected a X axis
    if (_.isEmpty(itemGroups.xAxis)) {
      console.warn('X axis is empty');
      enqueueSnackbar('X axis is empty', { variant: 'error' })
      return;
    }

    // not selected Y axis and selected Y2 axis
    if (itemGroups.xAxis.length > 0 && itemGroups.yAxis.length === 0 && itemGroups.y2Axis.length > 0) {
      console.warn('Y1 axis is empty and Y2 axis is not empty');
      enqueueSnackbar('Y1 axis is empty and Y2 axis is not empty', { variant: 'error' })
      return;
    }

    // Y2 axis have more cols that Y1 Axis
    if (itemGroups.yAxis.length < itemGroups.y2Axis.length) {
      console.warn('Y2 axis should be have maximum the number of column of Y1 Axis');
      enqueueSnackbar('Y2 axis should be have maximum the number of column of Y1 Axis', { variant: 'error' })
      return;
    }

    // Y1 axis is empty
    if (itemGroups.yAxis.length === 0) {
      console.warn('Y axis is empty');
      enqueueSnackbar('Y axis is empty', { variant: 'error' })
      return;
    }

    // Y1 axis have more cols that X Axis when X axis have more than one column
    if (itemGroups.xAxis.length > 1 && itemGroups.xAxis.length !== itemGroups.yAxis.length) {
      console.warn('Y1 should be have the same number of column of X axis');
      enqueueSnackbar('Y1 should be have the same number of column of X axis', { variant: 'error' })
      return;
    }

    // Y2 axis have more cols that X Axis when X axis have more than one column
    if (itemGroups.xAxis.length > 1 && itemGroups.xAxis.length < itemGroups.y2Axis.length) {
      console.warn('Y2 should be at less the same number of column of X axis');
      enqueueSnackbar('Y2 should be at less the same number of column of X axis', { variant: 'error' })
      return;
    }

    // One 'x' and various 'y'
    if (itemGroups.xAxis.length === 1 && itemGroups.xAxis.length <= itemGroups.yAxis.length) {

      console.log('X axis have only one column the Y1 and Y2 columns could have more than one column');
      enqueueSnackbar('X axis have only one column the Y1 and Y2 columns could have more than one column', { variant: 'info', autoHideDuration: 10000 })

      setSelectedColumns({
        ...csvFileColum,
        columns: csvFileColum.columns.map((column) => {
          const axis = itemGroups.xAxis.includes(column.name) && 'xaxis'
            || itemGroups.yAxis.includes(column.name) && 'yaxis'
            || itemGroups.y2Axis.includes(column.name) && 'yaxis2'
            || null

          let axisGroup = !!axis ? 'oneX' : null
          return {
            ...column,
            axis,
            axisGroup,
          }
        }),

      })
      return;
    }

    // various 'x' and various 'y'
    setSelectedColumns({
      ...csvFileColum,
      columns: csvFileColum.columns.map((column) => {
        const axis = itemGroups.xAxis.includes(column.name) && 'xaxis'
          || itemGroups.yAxis.includes(column.name) && 'yaxis'
          || itemGroups.y2Axis.includes(column.name) && 'yaxis2'
          || null

        let axisGroup
        if (axis === null) {
          axisGroup = null
        } else {
          axisGroup = () => {
            switch (axis) {
              case 'xaxis':
                return _.findIndex(itemGroups.xAxis, (name) => name === column.name)
              case 'yaxis':
                return _.findIndex(itemGroups.yAxis, (name) => name === column.name)
              case 'yaxis2':
                return _.findIndex(itemGroups.y2Axis, (name) => name === column.name)
              default:
                return null
            }
          }
        }

        return {
          ...column,
          axis,
          axisGroup: axisGroup && axisGroup(),
        }
      }),

    })
  }


  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragCancel = () => setActiveId(null);

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      setActiveId(null);
      return;
    }

    try {
      if (active.id !== over.id) {
        const activeContainer = active.data.current.sortable.containerId;
        const overContainer = over.data.current?.sortable.containerId || over.id;
        const activeIndex = active.data.current.sortable.index;
        const overIndex =
          over.id in itemGroups
            ? itemGroups[overContainer].length + 1
            : over.data.current.sortable.index;

        setItemGroups((itemGroups) => {
          let newItems;
          if (activeContainer === overContainer) {
            newItems = {
              ...itemGroups,
              [overContainer]: arrayMove(
                itemGroups[overContainer],
                activeIndex,
                overIndex
              ),
            };
          } else {
            newItems = moveBetweenContainers(
              itemGroups,
              activeContainer,
              activeIndex,
              overContainer,
              overIndex,
              active.id
            );
          }


          return newItems;
        });
      }
    } catch (e) {
      return
    } finally {
      setActiveId(null);
    }
  };

  const moveBetweenContainers = (
    items,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    item
  ) => {
    return {
      ...items,
      [activeContainer]: _.uniq(removeAtIndex(items[activeContainer], activeIndex)),
      [overContainer]: _.uniq(insertAtIndex(items[overContainer], overIndex, item)),
    };
  };

  React.useEffect(() => {
    if (csvFileColum?.columns?.length > 0) {
      setItemGroups({
        columns: _.filter(csvFileColum?.columns, (col) => col.axisGroup === null).map((col) => col.name),
        yAxis: _.sortBy(_.filter(csvFileColum?.columns, (col) => col.axis === 'yaxis'), ['axisGroup']).map((col) => col.name),
        xAxis: _.sortBy(_.filter(csvFileColum?.columns, (col) => col.axis === 'xaxis'), ['axisGroup']).map((col) => col.name),
        y2Axis: _.sortBy(_.filter(csvFileColum?.columns, (col) => col.axis === 'yaxis2'), ['axisGroup']).map((col) => col.name),
      })
    }

  }, []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <Tooltip title={'Apply changes'} >

        <IconButton sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: (theme) => theme.palette.grey[200],
          '&:hover': {
            backgroundColor: (theme) => theme.palette.grey[300],
          },
          opacity: 1,
          zIndex: (theme) => theme.zIndex.drawer * 10,
        }}
          size='small'
          onClick={handleApply}
        >
          <DoneAllIcon fontSize='inherit' color='success' />
        </IconButton>
      </Tooltip>
      <Grid display='flex' >
        <Droppable
          id='columns'
          items={itemGroups['columns']}
          name='Columns'
          isNotIndex
        />
        <Grid sx={{
          margin: 0,
          padding: 0,
        }}>
          <Droppable
            id='xAxis'
            items={itemGroups['xAxis']}
            name='X'
            isHorizontal
          />
          <Droppable
            id='yAxis'
            items={itemGroups['yAxis']}
            name='Y'
            isHorizontal
          />
          <Droppable
            id='y2Axis'
            items={itemGroups['y2Axis']}
            name='Y2'
            isHorizontal
          />
          {PlotlyChart}
        </Grid>
      </Grid>
      <DragOverlay>{activeId ? <Item id={activeId} isNotIndex index={0} dragOverlay /> : null}</DragOverlay>

    </DndContext>
  );
}

export default DragDrop;
