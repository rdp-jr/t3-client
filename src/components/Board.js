import React, { useState, useEffect } from 'react'
import Square from './Square'
import './Board.css'
import { calculateWinner } from '../functions/Functions'
// import _ from 'lodash'
// import { GameContext } from './GameContext'

const Board = ({ hasStart, hasAddedFlag, roomCode, isTurn, sendServer, boardSquares, setBoardSquares, isPlayerX, setScores }) => {
    
    const [hasSendServer, setHasSendServer] = useState(false)
    // const [hasAdded, setHasAdded] = useState(false)
    const [hasReset, setHasReset] = useState(false)
    
    // const { setScores } = useContext(GameContext)
    // console.log(`isTurn: ${isTurn}`)
    const [isDraw, setIsDraw] = useState(false)

    let newGameData = {
        boardSquares,
        isTurn,
        roomCode,
    }

    const handleDraw = (squares) => {   
        if (squares.includes(null)) return false;
        return true;
    }

    const handleClick = (index) => {
        const squares = [...boardSquares]
        
        if (squares[index] || isDraw || !isTurn) {
            // console.log('cannot click!')
            return;
        }
        // console.log('made a move!')
        squares[index] = isPlayerX ? "X" : "O"
        
        
        setBoardSquares(squares)
       
    
        setHasSendServer(true)   
    }

    const renderSquare = (index) => {
        return <Square 
                onClick={() => handleClick(index)} 
                value={boardSquares[index]}/>
    }

    
    const handleClickReset = (msg) => {
        // console.log('reset')
        setBoardSquares(Array(9).fill(null))
        setIsDraw(false)
        
        setHasReset(true)
        sendServer('gameReset', roomCode)
    }

    let winner = calculateWinner(boardSquares)
    let status;
    if (isTurn !== null) {
        if (winner) {
            status = `${winner} has won!`
        } else if (handleDraw(boardSquares)) {
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
    // console.log(`isDraw? ${isDraw}`)

    useEffect(() => {
        if (!hasAddedFlag) {
            let winner = calculateWinner(boardSquares)
            if (winner) {
                sendServer(`addScore${winner}`, roomCode)
                
            }
        }
    })

    useEffect(() => {    
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
            <div className="status"><h4>{status || 'Game has not started'}</h4></div>
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
            <div className="mt-3">
            <button onClick={() => handleClickReset("resetBoard")}
                    className="mr-3"
                    disabled={hasStart ? false : true}
                    >Reset Board</button>

            </div>
            
           
        </div>
        </>
    )
}

export default Board
