import React from "react";

import { COLORS } from '../../../utils/utils'

import "./Item.css";

const Item = ({ id, dragOverlay, index, isNotIndex = false }) => {
  return (
    <div
      style={{
        cursor: dragOverlay ? "grabbing" : "grab",
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        margin: '8px 10px',
        padding: '0px 10px',
        border: '1px solid gray',
        borderRadius: '5px',
        userSelect: 'none',
        backgroundColor: isNotIndex ? '' : COLORS[index],
        opacity: isNotIndex ? 1 : .7,
      }}
    >
      {id}
    </div>
  );
};

export default Item;
