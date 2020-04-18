import React from 'react'
// import { GameContext } from './GameContext'


const Stats = ({scores}) => {
    // const { scores } = useContext(GameContext)
    return (
        <>
        <div className="d-flex justify-content-center">
            <h1 className="mr-5">X: {scores.xScore}</h1>
            <h1>O: {scores.oScore}</h1>
        </div>
        </>
    )
}

export default Stats
