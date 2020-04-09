import React from "react"
import { map } from 'ramda'
import slug from 'slug'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Layout from "../components/layout"
import SEO from "../components/seo"

import CardFace from "./card-face"

const CardPage = ({ pageContext: { title, description, cards } }) => (
  <Layout>
    <SEO title={title} description={description} />
    <Container>
      {map(card => (
        <Row>
          <Col xs={12} md={6}>
            <CardFace side={card.front} href={`/cards/${slug(card.name).toLowerCase()}`} brand="Front" />
          </Col>
          <Col xs={12} md={6}>
            <CardFace side={card.back} href={`/cards/${slug(card.name).toLowerCase()}`} brand="Back" />
          </Col>
        </Row>
      ), cards)}
    </Container>
  </Layout>
)

export default CardPage
