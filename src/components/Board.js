import React, { useState, useEffect } from 'react'
import Square from './Square'
import './Board.css'
import { calculateWinner } from '../functions/Functions'
// import _ from 'lodash'
// import { GameContext } from './GameContext'

const Board = ({ scores, hasAddedFlag, roomCode, isTurn, sendServer, boardSquares, setBoardSquares, isPlayerX, setScores }) => {
    
    const [hasSendServer, setHasSendServer] = useState(false)
    const [hasAdded, setHasAdded] = useState(false)
    const [hasReset, setHasReset] = useState(false)
    
    // const { setScores } = useContext(GameContext)
    console.log(`isTurn: ${isTurn}`)
    const [isDraw, setIsDraw] = useState(false)
    
    // if (hasAddedFlag !== hasAdded) {
    //     console.log('hasAddedFlag !== hasAdded')
    //     console.log(`${hasAddedFlag} !== ${hasAdded}`)
    //     setHasAdded(hasAddedFlag)
    //     console.log(`AFTER ${hasAddedFlag} !== ${hasAdded}`)
    // }

    let newGameData = {
        boardSquares,
        isTurn,
        roomCode,
    }

    const handleDraw = (squares) => {   
        if (squares.includes(null)) return;
        setIsDraw(true)
    }

    const handleClick = (index) => {
        const squares = [...boardSquares]
        // if (squares[index] || isDraw || !isTurn || calculateWinner(boardSquares) ) {
        if (squares[index] || isDraw || !isTurn) {
            console.log('cannot click!')
            return;
        }
        console.log('made a move!')
        squares[index] = isPlayerX ? "X" : "O"
        setBoardSquares(squares)
        handleDraw(squares)

        // let winner = calculateWinner(boardSquares)
        // if (winner) {
        //     console.log('going to add score!')
        //     if (winner === "X") {
        //         setScores(prevScores =>({...prevScores, xScore: prevScores.xScore + 1}))
        //     } else if (winner=== "O") {
        //         setScores(prevScores =>({...prevScores, oScore: prevScores.oScore + 1}))
        //     }
        // }
    
        setHasSendServer(true)   
    }

    const renderSquare = (index) => {
        return <Square 
                onClick={() => handleClick(index)} 
                value={boardSquares[index]}/>
    }

    
    const handleClickReset = (msg) => {
        console.log('reset')
        setBoardSquares(Array(9).fill(null))
        setIsDraw(false)
        setHasAdded(false)
        setHasReset(true)
        sendServer('gameReset', roomCode)
    }

    let winner = calculateWinner(boardSquares)
    // console.log(winner)
    let status;
    if (isTurn !== null) {
        if (winner) {
            status = `${winner} has won!`
        } else if (isDraw) {
            status = "Draw!"
        } else {
            if (isTurn) {
                status = "Your Turn"
            } else {
                status = "Opponent's Turn"
            }
        } 
    } else {
        status = ''
    }

    // useEffect(() => {
    //     console.log(`hasAdded ${hasAdded}`)
        
    //     if (hasAdded === false && winner) {
    //         console.log('going to add score!')
    //         if (winner === "X") {
    //             setScores(prevScores =>({...prevScores, xScore: prevScores.xScore + 1}))
    //         } else if (winner=== "O") {
    //             setScores(prevScores =>({...prevScores, oScore: prevScores.oScore + 1}))
    //         }

    //         setHasAdded(true)
    //     }
    // }, [hasAdded, winner, setScores])

    useEffect(() => {
        if (!hasAddedFlag) {
            let winner = calculateWinner(boardSquares)
            if (winner) {
                sendServer(`addScore${winner}`, roomCode)
                // console.log('going to add score!')
                // if (winner === "X") {
                //     // setScores(prevScores =>({...prevScores, xScore: prevScores.xScore + 1}))
                // } else if (winner=== "O") {
                //     // setScores(prevScores =>({...prevScores, oScore: prevScores.oScore + 1}))
                // }
            }
        }
    })

    useEffect(() => {
        // console.log(`hasAdded? ${hasAdded}`)
        // console.log(winner)
        // if (hasAdded === false && winner) {
        //     console.log('useEffect yeah add')
        //     sendServer(`addScore${winner}`, roomCode)
            
            // if (winner === "X") {
            //     // setScores(prevScores =>({...prevScores, xScore: prevScores.xScore + 1}))
            //     sendServer('addScoreX', roomCode) 
            // } else if (winner === 'O') {
            //     sendServer('addScoreO', roomCode) 
            //     // setScores(prevScores =>({...prevScores, oScore: prevScores.oScore + 1}))
            // }

        //     setHasAdded(true)
        //     // sendServer('gameUpdate', newGameData)
        // }
        
        if (hasSendServer) {
            sendServer('gameUpdate', newGameData) 
            setHasSendServer(false)
        }

        if (hasReset) {
            sendServer('gameUpdate', newGameData)
            setHasReset(false)
        }

    }, [newGameData, boardSquares, roomCode, sendServer, hasSendServer, hasReset, isDraw, isTurn])
    
    return (
        <>
        <div>
            <div className="status">{status}</div>
            <div className="d-flex justify-content-center">
            <table className="board">
            <tbody>
            <tr className="">
                <td>{renderSquare(0)}</td>
                <td>{renderSquare(1)}</td>
                <td>{renderSquare(2)}</td>
            </tr>

            <tr className="">
                <td>{renderSquare(3)}</td>
                <td>{renderSquare(4)}</td>
                <td>{renderSquare(5)}</td>
            </tr>

            <tr className="">
                <td>{renderSquare(6)}</td>
                <td>{renderSquare(7)}</td>
                <td>{renderSquare(8)}</td>
            </tr>
            </tbody>
            </table>
            </div>
            <div className="mt-5">
            <button onClick={() => handleClickReset("resetBoard")}
                    className="mr-3">Reset Board</button>

            </div>
        </div>
        </>
    )
}

export default Board
