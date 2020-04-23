import React from 'react'
import './Square.css'

const Square = (props) => {
    return (
        <button 
            className="square textMarker"
            onClick={props.onClick}>
            {props.value}
        </button>
    )
}

export default Square
