import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const ClientCardDrawer = ({ stacks, allCardsIsOpen, drawerCallback }) => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper
      }}
      anchor={'left'}
      open={allCardsIsOpen}
      onClose={() => drawerCallback(false)}
    >
      <div className={classes.drawerContainer}>
        Hello World
      </div>
    </Drawer>
  )
}
  
  export default ClientCardDrawer