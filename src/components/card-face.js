import React from "react"
import Badge from "react-bootstrap/Badge"
import Card from "react-bootstrap/Card"
import { Link } from 'gatsby'

import { /* join, */ map } from 'ramda'
import slug from 'slug'

// const singleBadge = tags => <Badge variant="secondary">{join(', ', tags || [])}</Badge>

const multiBadge = tags => map(tag => (
  <span>
    <Badge variant="secondary">
      <Link style={{"color": "inherit", "text-decoration": "inherit"}} to={`/tags/${slug(tag).toLowerCase()}`}>{tag}</Link>
    </Badge>{` `}
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

