import React from 'react'

const Stats = ({scores}) => {
    
    return (
        <>
        <div className="d-flex justify-content-center">
            <h1 className="mr-5"> <span className="textMarker">X: </span>{scores.xScore}</h1>
            <h1 className="ml-5"> <span className="textMarker">O: </span>{scores.oScore}</h1>            
        </div>
        </>
    )
}

export default Stats
