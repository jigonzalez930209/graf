import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grid } from "@mui/material";

import Item from "./Item";
import { droppableItem } from "./DragDrop";

type SortableItemProps = {
  item: droppableItem;
  isHorizontal: boolean;
  isNotIndex: boolean;
}

const SortableItem = ({ item, isHorizontal, isNotIndex }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    index,
  } = useSortable({ id: item.name, data: item, });

  return (
    <Grid
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <Item isHorizontal={isHorizontal} item={item} dragOverlay={isDragging} isNotIndex={isNotIndex} index={index} />
    </Grid>
  );
};

export default SortableItem;
