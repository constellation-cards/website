import { Link, withPrefix } from "gatsby"
import PropTypes from "prop-types"

import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import IconButton from "@material-ui/core/IconButton"
import Toolbar from "@material-ui/core/Toolbar"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"

// Icons
import HomeIcon from "@material-ui/icons/Home"
import MenuBookIcon from "@material-ui/icons/MenuBook"
import ViewAgendaIcon from "@material-ui/icons/ViewAgenda"
import PlayArrowIcon from "@material-ui/icons/PlayCircleOutline"
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf"
import PrintIcon from "@material-ui/icons/Print"
import GitHubIcon from "@material-ui/icons/GitHub"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  }
}))

const IconExternalLink = ({ title, href, children }) => (
  <Tooltip title={title}>
    <IconButton
      edge="end"
      color="inherit"
      aria-label="allcards"
      href={href}
      rel={"nofollow"}
      target={"_blank"}
    >
      {children}
    </IconButton>
  </Tooltip>
)

const IconLink = ({ title, to, children }) => (
  <Tooltip title={title}>
    <IconButton
      edge="end"
      color="inherit"
      aria-label="allcards"
      component={Link}
      to={to}
    >
      {children}
    </IconButton>
  </Tooltip>
)

const Header = ({ siteTitle }) => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar variant="dense">
        <Typography variant="h6">{siteTitle}</Typography>
        <IconLink title={"Home"} to={`/`}>
          <HomeIcon />
        </IconLink>
        <IconLink title={"Rules"} to={`/rules/`}>
          <MenuBookIcon />
        </IconLink>
        <IconLink title={"All Cards"} to={`/all-cards`}>
          <ViewAgendaIcon />
        </IconLink>
        <IconLink title={"Play Interactive"} to={`/play`}>
          <PlayArrowIcon />
        </IconLink>
        <IconExternalLink title={"PDF (Web)"} href={withPrefix(`/cards.pdf`)}>
          <PictureAsPdfIcon />
        </IconExternalLink>
        <IconExternalLink
          title={"PDF (Print)"}
          href={withPrefix(`/cards-print.pdf`)}
        >
          <PrintIcon />
        </IconExternalLink>
        <IconExternalLink
          title={"Github"}
          href={`https://github.com/constellation-cards/website`}
        >
          <GitHubIcon />
        </IconExternalLink>
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
