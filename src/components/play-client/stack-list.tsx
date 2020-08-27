import React from "react"
import { map } from "ramda"

import { makeStyles } from "@material-ui/core/styles"
import Collapse from "@material-ui/core/Collapse"
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import NavigateNextIcon from "@material-ui/icons/NavigateNext"
import Tooltip from "@material-ui/core/Tooltip"

import { Card, Stacks } from "./index"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

interface StackListProps {
  stacks: Stacks
  stackName: string
  dealStackAction: Function,
  dealCardAction: Function
}

function cardListItem(classes, card: Card, dealCardAction: Function) {
  const onClick = dealCardAction(card)
  return (
    <ListItem button className={classes.nested} onClick={onClick}>
      <ListItemText primary={card.name} />
      <ListItemSecondaryAction>
        <Tooltip title="Deal this specific card">
          <IconButton
            edge="end"
            aria-label="deal"
            onClick={onClick}
          >
            <NavigateNextIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default function StackList({ stacks, stackName, dealStackAction, dealCardAction }: StackListProps) {
  const classes = useStyles()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleClick = () => setIsOpen(!isOpen)

  return (
    <>
      <ListItem key={stackName} onClick={handleClick}>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
        <ListItemText primary={stackName} />
        <ListItemSecondaryAction>
          <Tooltip title="Deal a random card from this stack">
            <IconButton
              edge="end"
              aria-label="deal"
              onClick={dealStackAction(stackName)}
            >
              <DoubleArrowIcon />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {map((card: Card) => cardListItem(classes, card, dealCardAction), stacks[stackName])}
        </List>
      </Collapse>
    </>
  )
}
