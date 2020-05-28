import { Link, withPrefix } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import AppBar from "@material-ui/core/AppBar"
import IconButton from "@material-ui/core/IconButton"
import Toolbar from "@material-ui/core/Toolbar"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"

// Icons
import HomeIcon from "@material-ui/icons/Home"
import MenuBookIcon from '@material-ui/icons/MenuBook'
import ViewAgendaIcon from "@material-ui/icons/ViewAgenda"
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf"
import PrintIcon from "@material-ui/icons/Print"
import GitHubIcon from "@material-ui/icons/GitHub"

const IconExternalLink = ({ title, href, children }) => (
  <Tooltip title={title}>
    <IconButton
      edge="end"
      color="inherit"
      aria-label="allcards"
      href={href}
      rel={'nofollow'}
      target={'_blank'}
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
      to={withPrefix(to)}
    >
      {children}
    </IconButton>
  </Tooltip>
)

const Header = ({ siteTitle }) => (
  <AppBar position="static">
    <Toolbar variant="dense">
      <Typography variant="h6">{siteTitle}</Typography>
      <IconLink title={'Home'} to={`/`}>
        <HomeIcon />
      </IconLink>
      <IconLink title={'Rules'} to={`/rules`}>
        <MenuBookIcon />
      </IconLink>
      <IconLink title={'All Cards'} to={`/all-cards`}>
        <ViewAgendaIcon />
      </IconLink>
      <IconLink title={'PDF (Web)'} to={`/cards.pdf`}>
        <PictureAsPdfIcon />
      </IconLink>
      <IconLink title={'PDF (Print)'} to={`/cards-print.pdf`}>
        <PrintIcon />
      </IconLink>
      <IconExternalLink title={'Github'} href={`https://github.com/astralfrontier/flip-a-card`}>
        <GitHubIcon />
      </IconExternalLink>
    </Toolbar>
  </AppBar>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
