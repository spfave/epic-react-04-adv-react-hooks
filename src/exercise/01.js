// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

// Extra credit 1: accept the prop step as the action
// Extra credit 2: store the state within an object
// Extra credit 3: allowing updating state with a function or value
// Extra credit 4: use switch statement convention base on action type
function countReducer(state, action) {
  // return newState // base solution
  // return state + newState // EC1
  // return {...state, ...newState} // EC2
  // return {...state, ...(typeof action === 'function' ? action(state) : action)} // EC3
  switch (action.type) {
    // EC4
    case 'INCREMENT': {
      return {...state, count: state.count + action.step}
    }
    default: {
      throw new Error(`Unsupported action type ${action.type}`)
    }
  }
}

function Counter({initialCount = 0, step = 1}) {
  // 🐨 replace React.useState with React.useReducer.
  // 💰 React.useReducer(countReducer, initialCount)
  // const [count, setCount] = React.useState(initialCount)
  // const [count, setCount] = React.useReducer(countReducer, initialCount) //base solution
  // const [count, changeCount] = React.useReducer(countReducer, initialCount) //EC1
  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  }) //EC2,3,4
  const {count} = state //EC2,3,4

  // 💰 you can write the countReducer function so you don't have to make any
  // changes to the next two lines of code! Remember:
  // The 1st argument is called "state" - the current value of count
  // The 2nd argument is called "newState" - the value passed to setCount
  // const increment = () => setCount(count + step) // base solution
  // const increment = () => changeCount(step) //EC1
  // const increment = () => setState({count: count + step}) // EC2
  // const increment = () =>
  //   setState(currentState => ({count: currentState.count + step})) // EC3
  const increment = () => dispatch({type: 'INCREMENT', step}) // EC4

  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
