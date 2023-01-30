import * as  React from "react";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { colors, Divider, Grid } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { makeStyles } from "@mui/styles";
import { useScreen } from "usehooks-ts";

import { GrafContext } from "../../../context/GraftContext";

import SortableItem from "./SortableItem";
import { droppableItem } from "./DragDrop";

const useStyles = makeStyles({
  sortableContextContainer: {
    "&::-webkit-scrollbar": {
      width: 2,
      height: 3
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "silverlight"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "silver",
      borderRadius: 2
    },
    minWidth: '100%',
    padding: '0px 0px 2px 0px',
    gap: '3px',
    overflow: 'auto',
  },
  arrow: {
    width: 0,
    height: 0,
    borderBottom: '5px solid transparent',
    borderTop: '5px solid transparent',
    borderRight: '5px solid red',
  },
  dropHere: {
    width: '80%',
    textAlign: 'center',
    height: 10,
    margin: 0,
    padding: 0,
    color: colors.grey[700],
  },
  root: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    padding: 0,
  },
  sortableContainer: {
    "&::-webkit-scrollbar": {
      width: 4,
      height: 3
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "silverlight"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "silver",
      borderRadius: 2
    },
  }

});

type DroppableProps = {
  id: string,
  items: droppableItem[],
  isHorizontal?: boolean,
  name: string,
  isNotIndex?: boolean,
}

const Droppable = ({ id, items, isHorizontal = false, name, isNotIndex = false }: DroppableProps) => {
  const { setNodeRef, over, active } = useDroppable({ id });
  const { width } = useScreen()
  const classes = useStyles();
  const { graftState: { drawerOpen } } = React.useContext(GrafContext);

  const isHovering = over?.id === id || over?.data?.current?.sortable?.containerId === id;

  const title = (<>
    <h6 style={{ marginLeft: isHorizontal && 8, marginTop: 0, marginBottom: 0, padding: 0, width: isHorizontal ? 20 : 120, display: 'block' }}>{name}</h6>
    <Divider flexItem orientation={isHorizontal ? 'vertical' : 'horizontal'} />
  </>)

  return (
    <Grid item
      xs={isHorizontal && 12}
      className={classes.root} sx={{
        maxWidth: isHorizontal ? drawerOpen ? width * 1 : width * 1 : 155,
        flexDirection: isHorizontal ? 'row' : 'column',
        margin: isHorizontal ? '0px 0px 2px 0px' : '0 2px 0 0',
        userSelect: 'none',
        border: (active && isHorizontal)
          ? !isHovering
            ? `1px solid ${colors.amber[300]}`
            : `1px solid ${colors.lightBlue[300]}`
          : `1px solid ${colors.grey[400]}`,
      }}>
      <>
        {title}
      </>

      <Grid
        ref={setNodeRef}
        container
        className={classes.sortableContainer}
        style={{
          width: isHorizontal ? drawerOpen ? width * 0.72 : width * 0.876 : 140,
          height: isHorizontal ? 30 : '90vh',
          paddingTop: isHorizontal ? 0 : 8,
          paddingLeft: isHorizontal ? 4 : 4,
          paddingRight: isHorizontal ? 0 : 4,
          marginRight: isHorizontal ? 0 : 4,
          alignContent: isHorizontal ? 'center' : 'start',
          overflow: 'auto',

        }}
      >
        <SortableContext id={id} items={items.map(d => d.name)} strategy={rectSortingStrategy}>
          {items?.length > 0 ? (
            <div className={classes.sortableContextContainer}
              {...(isHorizontal && {
                style: {
                  width: (items.length - 1) * 150,
                  overflow: 'scroll',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                }
              })}>
              {items.map((item, i) => (<React.Fragment key={item.name}>
                {
                  (over?.data?.current?.sortable?.index === i &&
                    over?.data?.current?.sortable?.containerId === id) &&
                  <div className={classes.arrow}
                    style={{ display: isHorizontal ? 'block' : 'none' }} />
                }
                <SortableItem isNotIndex={isNotIndex} isHorizontal={isHorizontal} key={item.name} item={item} />
                {(items.length - i <= 1 && over?.data?.current === undefined && over?.id === id) &&
                  <div className={classes.arrow} style={{ display: isHorizontal ? 'block' : 'none' }} />
                }
              </React.Fragment>
              ))}
            </div>
          ) : (
            <h6
              className={classes.dropHere}
              {...(!isHorizontal && { style: { marginTop: 50 } })}

            >{id === 'columns' ? 'Not CSV file Selected' : 'Drop here'}</h6>
          )}
        </SortableContext >
      </Grid>

    </Grid >
  );
};

export default Droppable;
