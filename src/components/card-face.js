import React from "react"
import Badge from "react-bootstrap/Badge"
import Card from "react-bootstrap/Card"

import { /* join, */ map } from 'ramda'

// const singleBadge = tags => <Badge variant="secondary">{join(', ', tags || [])}</Badge>

const multiBadge = tags => map(tag => (
  <span>
    <Badge variant="secondary">{tag}</Badge>{` `}
  </span>
), tags || [])

const CardFace = ({ side, brand }) => (
  <div style={{ "margin-bottom": "1em" }}>
    <Card>
      <Card.Body>
        <strong><u>{side.name} ({brand})</u></strong>{` `}
        {multiBadge(side.tags)}
        <p>{side.desc}</p>
        <ul>
          {(side.prompts || []).map(prompt => (
            <li>{prompt}</li>
          ))}
        </ul>
        <em>{side.rule}</em>
      </Card.Body>
    </Card>

  </div>
)

export default CardFace

