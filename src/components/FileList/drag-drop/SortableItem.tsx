import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grid } from "@mui/material";

import Item from "./Item";

const SortableItem = ({ id, isHorizontal, isNotIndex }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    index,
  } = useSortable({ id });

  return (
    <Grid
      item
      xs={isHorizontal ? 3 : 12}
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
      <Item id={id} dragOverlay={isDragging} isNotIndex={isNotIndex} index={index} />
    </Grid>
  );
};

export default SortableItem;
