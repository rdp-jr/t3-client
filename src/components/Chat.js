import React, { useState, useRef, useEffect } from 'react'
import './Chat.css'

const Chat = ({sendServer, chatData, isPlayerX, isTyping, roomCode }) => {
  const [chatMessage, setChatMessage] = useState('')
  
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleChange = (e) => {
    setChatMessage(e.target.value)
  }

  const handleSubmit = (e) => {

    const chatMessageData = {
      message: chatMessage,
      isSystemMessage: false,
      roomCode,
      isPlayerX
    }

    if (chatMessage) {
      sendServer('chatMessage', chatMessageData)
      setChatMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter!')
      handleSubmit()
      sendServer('chatTyping', false)
    } else {
      sendServer('chatTyping', true)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatData])
  
  return (
    <>
    <div className="ml-5 mt-2">
      <div id="chatWindow">
        <div id="output">
          {chatData.map(chatMessageData => (<p className={`${chatMessageData.isSystemMessage ? 'system-message': chatMessageData.isPlayerX ? 'user-message-x' : 'user-message-o'}`} key={Math.random()}>{chatMessageData.message}</p>))}
          <div id="typing" className="system-message">{ isTyping ? "Opponent is typing..." : ""}</div>
          <div ref={chatEndRef} />
        </div>
        
      </div>
      
      <div id="inputDiv">
      <input type="text" 
              id="messageInput" 
              placeholder={roomCode !== null ? "Type a message here" : "Create or join a room"} 
              value={chatMessage} 
              onChange={handleChange} 
              onKeyPress={handleKeyPress}
              disabled={roomCode ? false : true}
              />
      <button id="sendBtn" onClick={handleSubmit} >Send</button>
      </div>
      </div>
      
      
    </>
  )
}

export default Chat
