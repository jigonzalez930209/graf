import React from "react";
import { Box } from "@mui/material";

import { COLORS } from '../../../utils/utils'
import { droppableItem } from "./DragDrop";

type ItemProps = {
  item: droppableItem;
  isHorizontal?: boolean;
  isNotIndex?: boolean;
  dragOverlay?: boolean;
  index: number;
}

const Item = ({ item, dragOverlay, index, isNotIndex = false, isHorizontal = false }: ItemProps) => {
  return (
    <Box
      sx={{
        width: 120,
        cursor: dragOverlay ? "grabbing" : "grab",
        alignItems: 'center',
        boxSizing: 'border-box',
        fontSize: '10px',
        margin: '0',
        marginBottom: isHorizontal ? 0 : '4px',
        padding: '2px 4px',
        border: '1px solid gray',
        borderRadius: '10px',
        backgroundColor: isNotIndex ? '#Eef0f0' : COLORS[index],
        opacity: isNotIndex ? 1 : .7,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: (theme) => typeof index === 'number' && isHorizontal && theme.palette.getContrastText(COLORS[index]),
      }}
    >
      {item.name}
    </Box>
  );
};

export default Item;
