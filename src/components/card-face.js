import React from "react"
import { navigate, Link } from "gatsby"

import Chip from '@material-ui/core/Chip';
import Paper from "@material-ui/core/Paper"

import { map } from "ramda"
import slug from "slug"

// const singleBadge = tags => <Badge variant="secondary">{join(', ', tags || [])}</Badge>

const invisStyle = { color: "inherit", textDecoration: "inherit" }

const multiBadge = tags =>
  map(
    tag => (
        <Chip
          label={tag}
          size="small"
          clickable
          onClick={() => navigate(`/tags/${slug(tag).toLowerCase()}`)}
        />
    ),
    tags || []
  )

function formatDesc(line) {
  const trimmed = line.trim()
  if (trimmed.startsWith("//")) {
    return <i>{trimmed.substr(2)}</i>
  } else {
    return trimmed
  }
}

const CardFace = ({ side, brand, href }) => (
  <Paper style={{padding: "1em"}}>
    <strong>
      <u>
        <Link style={invisStyle} to={href}>
          {side.name} ({brand})
        </Link>
      </u>
    </strong>
    {` `}
    {multiBadge(side.tags)}
    <>
      {map(
        s => (
          <p>{formatDesc(s)}</p>
        ),
        (side.desc || "").split("\n")
      )}
    </>
    <ul>
      {(side.prompts || []).map(prompt => (
        <li>{prompt}</li>
      ))}
    </ul>
    <p style={{ textAlign: "center" }}>
      <em>{side.rule}</em>
    </p>
  </Paper>
)

export default CardFace
