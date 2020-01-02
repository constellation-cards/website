import React from "react"
import { map } from 'ramda'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Layout from "../components/layout"
import SEO from "../components/seo"

import CardFace from "./card-face"

const CardPage = ({ pageContext: { title, cards } }) => (
  <Layout>
    <SEO title={title} />
    <Container>
      {map(card => (
        <Row>
          <Col sm={6}>
            <CardFace side={card.front} brand="Front" />
          </Col>
          <Col sm={6}>
            <CardFace side={card.back} brand="Back" />
          </Col>
        </Row>
      ), cards)}
    </Container>
  </Layout>
)

export default CardPage
