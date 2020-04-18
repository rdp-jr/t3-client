import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Board from './components/Board'
import { GameProvider } from './components/GameContext'
import Stats from './components/Stats'
import socketIOClient from 'socket.io-client'
import Chat from './components/Chat'
import _ from 'lodash'
import { calculateWinner } from './functions/Functions'
// import { GameContext } from './components/GameContext'
const socket = socketIOClient('https://t3-server.herokuapp.com')

function App() {
  const [boardSquares, setBoardSquares] = useState(Array(9).fill(null))
  // const { setScores } = useContext(GameContext)
  
  const [hasAddedFlag, setHasAddedFlag] = useState(false)
  const [scores, setScores] = useState({
    xScore: 0,
    oScore: 0,
  })

  const initialState = {
    chatData: [],
    isPlayerX: null,
    isTyping: false,
    roomCode: null,
  }

  const [state, setState] = useState(initialState)  

  const [isTurn, setIsTurn] = useState(null)
  const [inputRoomCode, setInputRoomCode] = useState('')


  const [history, setHistory] = useState('')

  const sendServer = (type, data) => {
    if (_.isEqual(history, data)) {
      console.log(`[CLIENT] Blocked duplicate message of TYPE[${type}]`)
    } else {
      console.log(`[CLIENT] Emitting TYPE[${type}]...`)
      console.log(data)
      socket.emit(type, data)
      setHistory({type, data})
    }
    
    
  }

  const updateGameData = useCallback((data) => {

    setBoardSquares(data.boardSquares)
    
    if (_.isEqual(Array(9).fill(null), data.boardSquares)) {
      console.log('[CLIENT] Game Board reset!')
      setIsTurn(state.isPlayerX)
      setHasAddedFlag(false)
      // setHasAdded(false)
      // setHasAdded(false)

    } else if (calculateWinner(data.boardSquares)) {
      console.log('[CLIENT] Game is finished!')
      setHasAddedFlag(true)
      // setScores(data.scores)
      // setHasAdded(true)
      setIsTurn(false)
    } else {
      
      console.log('[CLIENT] Waiting for next turn')
      setIsTurn(prevState => !prevState)
    }    
  }, [state.isPlayerX])

  const updateChatData = useCallback((data) => {
    let newChatData = [...state.chatData, data]
    setState(prevState => ({...prevState, chatData: newChatData}))
  }, [state.chatData])

  const updateIsTyping = useCallback((data) => {
    setState(prevState => ({...prevState, isTyping: data}))
    
  }, [])

  const updateRoomCode = useCallback((data) => {
    setState(prevState => ({...prevState, roomCode: data}))
    setInputRoomCode(data)
  }, [])

  const updateIsPlayerX = useCallback((data) => {
    setState(prevState => ({...prevState, isPlayerX: data}))
  }, [])

  const updateScore = useCallback((data) => {
    console.log('updating score..')
    console.log(data)
    // if (hasAdded === false) {
    //   if (player === 'X') {
    //     setScores(prevScores =>({...prevScores, xScore: prevScores.xScore + 1}))
    //   } else {
    //     setScores(prevScores =>({...prevScores, oScore: prevScores.oScore + 1}))
    //   }
    // }

    // setHasAdded(true)

    setScores(data)
    
  }, [setScores])

  

  useEffect(() => {
      
      socket.on('systemMessage', async (data) => {
        console.log(`[CLIENT] Received data chatData ${data} from [SERVER]`)

        updateChatData(data)
      })

      socket.on('chatData', async (data) => {
        console.log(`[CLIENT] Received data chatData ${data} from [SERVER]`)   
        updateChatData(data)
      })

      socket.on('chatTyping', async (data) => {
        console.log(`[CLIENT] Received data chatTyping ${data} from [SERVER]`)
        updateIsTyping(data)  
      })

      socket.on('createRoom', async (data) => {
        updateRoomCode(data)
        updateIsPlayerX(true)
      })

      socket.on('joinRoom', async (data) => {
        updateRoomCode(data)
        updateIsPlayerX(false)
      })

      socket.on('gameData', async (data) => {
        console.log(`[CLIENT] Game Board updated`)
        console.log(data)
        updateGameData(data)
      })

      socket.on('gameStart', () => {
        setIsTurn(state.isPlayerX)
      })

      socket.on('addScoreX', (data) => {
        updateScore(data)
      })

      socket.on('addScoreO', (data) => {
        updateScore(data)
      })
     
      return () => {
        socket.off('chatData')
        socket.off('chatTyping')
        socket.off('systemMessage')
        socket.off('createRoom')
        socket.off('joinRoom')
        socket.off('gameData')
        socket.off('gameStart')
      }
    
  }, [updateScore, updateChatData, updateIsTyping, updateRoomCode, updateIsPlayerX, updateGameData, state.isPlayerX])

  const createRoom = () => {
    sendServer('createRoom')
  }

  const joinRoom = () => {
    sendServer('joinRoom', inputRoomCode)
  }

  const handleChange = (e) => {
    setInputRoomCode(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      joinRoom()
    } 
  }
  return (
    <GameProvider>
    <div className="App">
      <div className="">
      <Stats scores={scores}/>
      </div>
      <div className="d-flex justify-content-center">
      <Board sendServer={sendServer}
            isTurn={isTurn} 
            roomCode={state.roomCode}
            boardSquares={boardSquares}
            setBoardSquares={setBoardSquares}
            isPlayerX={state.isPlayerX}
            hasAddedFlag={hasAddedFlag}
            // setHasAdded={setHasAdded}
            scores={scores}
            setScores={setScores}
            />

      <Chat sendServer={sendServer} 
            chatData={state.chatData} 
            isPlayerX={state.isPlayerX} 
            isTyping={state.isTyping}
            roomCode={state.roomCode}
            />
      </div>
      <div>
        <button onClick={createRoom} disabled={state.roomCode ? true : false}>Create Room</button>
        <input type="text" value={inputRoomCode} 
                          onChange={handleChange} 
                          onKeyPress={handleKeyPress}
                          placeholder="Enter a room code"
                          disabled={state.roomCode ? true : false}>
                          </input>
        <button onClick={joinRoom} 
        
        disabled={state.roomCode ? true : false}>Join Room</button>
      </div>   
    </div>
    </GameProvider>
    
  );
}

export default App;
