import React from "react"
import Badge from "react-bootstrap/Badge"
import Card from "react-bootstrap/Card"

import { join } from 'ramda'

const CardFace = ({ side, brand }) => (
  <div style={{ "margin-bottom": "1em" }}>
    <Card>
      <Card.Body>
        <strong><u>{side.name} ({brand})</u></strong>
        <Badge variant="secondary">{join(', ', side.tags || [])}</Badge>
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

