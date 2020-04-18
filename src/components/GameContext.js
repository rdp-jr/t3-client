import React, { useState, createContext } from 'react';

export const initialScores = {
    xScore: 0,
    oScore: 0,
}

export const GameContext = createContext({
    scores: initialScores,
    setScores: () => {}
})

// const reducer = (state, action) => {
//     console.log(action)
//     const prevState = state
//     switch (action.type) {
//         case "INCREMENTX":
//             return {...state, xScore: prevState.xScore + 1}
//         case "INCREMENTO":
//             return {...state, oScore: prevState.oScore + 1}
//         default:
//             return state
//     }
// }


export const GameProvider = (props) => {
    // const [state, dispatch] = useReducer(reducer, initialState)
    const [scores, setScores] = useState(initialScores)

    // const addX = () => {
    //     const prevState = state
    //     setState({ ...state, xScore: prevState.xScore + 1})
    // }

    return (
        // <GameContext.Provider value={{data: state, update}}> 
        <GameContext.Provider value={{ 
            scores, setScores
            // addX: () => {
            //     const prevState = state
            //     setState({ ...state, xScore: prevState.xScore + 1})
            // } 
        }}>

        {props.children}
        </GameContext.Provider>
    )
}