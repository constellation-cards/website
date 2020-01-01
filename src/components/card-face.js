import React from "react"

const CardFace = ({ side, brand }) => (
  <div>
    <strong><u>{side.name} ({brand})</u></strong>
    <p>{side.desc}</p>
    <ul>
      {(side.prompts || []).map(prompt => (
        <li>{prompt}</li>
      ))}
    </ul>
    <em>{side.rule}</em>
    <hr style={{"margin-left": "auto", "margin-right": "auto", width: '50%'}} />
  </div>
)

export default CardFace

