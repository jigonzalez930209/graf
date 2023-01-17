import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Grid } from "@mui/material";

import SortableItem from "./SortableItem";

import "./Droppable.css";

const Droppable = ({ id, items, isHorizontal = false, name, isNotIndex = false }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
      <Grid item xs={isHorizontal ? 12 : 3} sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        width: '100%',
        padding: 0,
        margin: isHorizontal ? '0px 0px 8px 0px' : '8px 0px 0px 0px',
      }}>

        <h3 style={{ margin: 0, padding: 0 }}>{name}</h3>
        <Grid container style={{
          borderRadius: '18px',
          border: '2px dashed skyblue',
          boxShadow: '0 0 5px 0px rgba(0,0,0,0.5)',
          // display: "flex",
          width: '90%',
          height: isHorizontal ? 120 : 200,
          padding: '8px',
          alignContent: 'start',
          alignItems: 'normal',
          justifyContent: 'start',
          justifyItems: 'start',
          overflow: 'auto',
        }} ref={setNodeRef}>

          {items?.length > 0 ? items.map((item) => (
            <SortableItem isNotIndex={isNotIndex} isHorizontal={isHorizontal} key={item} id={item} />
          )) : (
            <p
              style={{
                width: '80%',

                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',

              }}
            >Drop here</p>
          )}
        </Grid>
      </Grid>

    </SortableContext>
  );
};

export default Droppable;
