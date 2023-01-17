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
import Chart from '../../../assets/ChartXYY2.png';

import Droppable from "./Droppable";
import Item from "./Item";
import { arrayMove, insertAtIndex, removeAtIndex } from "./utils/array";

import "./Container.css";
import { Grid } from "@mui/material";
import { columns } from "../../../interfaces/interfaces";
import { GrafContext } from "../../../context/GraftContext";
import _ from "lodash";

export type ColumnsGroup = {
  columns: string[]
  yAxis: string[]
  xAxis: string[]
  y2Axis: string[]
}

const DragDrop = ({ onChange }: { onChange: (colGroup: ColumnsGroup) => void }) => {

  const { graftState: { columns } } = React.useContext(GrafContext);

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

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragCancel = () => setActiveId(null);

  const handleDragOver = ({ active, over }) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (activeContainer !== overContainer) {
      setItemGroups((itemGroups) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex =
          over.id in itemGroups
            ? itemGroups[overContainer].length + 1
            : over.data.current.sortable.index;

        return moveBetweenContainers(
          itemGroups,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id
        );
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      setActiveId(null);
      return;
    }

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

    setActiveId(null);
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
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, item),
    };
  };

  React.useEffect(() => {
    console.error({ columns })
    setItemGroups({
      columns: _.filter(columns.columns, (col) => col.axisGroup === null).map((col) => col.name),
      yAxis: _.sortBy(_.filter(columns.columns, (col) => col.axis === 'yaxis'), ['axisGroup']).map((col) => col.name),
      xAxis: _.sortBy(_.filter(columns.columns, (col) => col.axis === 'xaxis'), ['axisGroup']).map((col) => col.name),
      y2Axis: _.sortBy(_.filter(columns.columns, (col) => col.axis === 'yaxis2'), ['axisGroup']).map((col) => col.name),
    })

  }, []);

  React.useEffect(() => {
    onChange(itemGroups);
  }, [itemGroups]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Grid container sx={{ width: '100%', display: 'flex', justifyContent: 'center', margin: 0, padding: 0 }}>
        <Droppable
          id='columns'
          items={itemGroups['columns']}
          name='Columns'
          isHorizontal
          isNotIndex
        />
        <Grid item xs={12} sx={{
          width: '100%',
          display: 'flex',
          margin: 0,
          padding: 0,
          height: '250px',
          justifyContent: 'space-around',
        }}>

          <Droppable
            id='yAxis'
            items={itemGroups['yAxis']}
            name='y Axis'
          />

          <img src={Chart} alt="Chart" style={{
            transform: 'scale(1.1)',
            marginTop: 0,
          }} />
          <Droppable
            id='y2Axis'
            items={itemGroups['y2Axis']}
            name='y2 Axis'
          />
        </Grid>

        <Droppable
          id='xAxis'
          items={itemGroups['xAxis']}
          name='xAxis'
          isHorizontal
        />
      </Grid>
      <DragOverlay>{activeId ? <Item id={activeId} isNotIndex index={0} dragOverlay /> : null}</DragOverlay>

    </DndContext>
  );
}

export default DragDrop;
