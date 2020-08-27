import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"

import { Stack, Stacks } from "./index"

const drawerWidth = 360

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

interface ClientCardDrawerProps {
  allCardsIsOpen: boolean;
  drawerCallback: Function;
  children: any;
}

const ClientCardDrawer = ({
  allCardsIsOpen,
  drawerCallback,
  children,
}: ClientCardDrawerProps) => {
  const classes = useStyles()

  return (
    <Drawer
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor={"left"}
      open={allCardsIsOpen}
      onClose={() => drawerCallback(false)}
    >
      <div className={classes.drawerContainer}>{children}</div>
    </Drawer>
  )
}

export default ClientCardDrawer
