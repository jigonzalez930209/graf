import React from "react";
import { Box } from "@mui/material";

import { COLORS } from '../../../utils/utils'

const Item = ({ id: name, dragOverlay, index, isNotIndex = false, isHorizontal = false }) => {
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
      {name}
    </Box>
  );
};

export default Item;
