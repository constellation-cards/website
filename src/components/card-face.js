import React from "react"
import Badge from "react-bootstrap/Badge"
import Card from "react-bootstrap/Card"
import { Link } from 'gatsby'

import { map } from 'ramda'
import slug from 'slug'

// const singleBadge = tags => <Badge variant="secondary">{join(', ', tags || [])}</Badge>

const invisStyle = { "color": "inherit", "text-decoration": "inherit" }

const multiBadge = tags => map(tag => (
  <span>
    <Badge variant="secondary">
      <Link style={invisStyle} to={`/tags/${slug(tag).toLowerCase()}`}>{tag}</Link>
    </Badge>{` `}
  </span>
), tags || [])

const CardFace = ({ side, brand, href }) => (
  <div style={{ "margin-bottom": "1em" }}>
    <Card>
      <Card.Body>
        <strong><u><Link style={invisStyle} to={href}>{side.name} ({brand})</Link></u></strong>{` `}
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

