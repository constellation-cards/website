import { withPrefix } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

const Header = ({ siteTitle }) => (
  <Navbar bg="primary" variant="dark" expand="lg">
    <Navbar.Brand href={withPrefix('/')}>{siteTitle}</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href={withPrefix('/')}>Home</Nav.Link>
        <Nav.Link href={withPrefix('/all-cards')}>All Cards</Nav.Link>
        <Nav.Link href={withPrefix('/flip-a-card.zip')}>Download</Nav.Link>
        <Nav.Link href={'https://github.com/astralfrontier/flip-a-card'}>Github</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
