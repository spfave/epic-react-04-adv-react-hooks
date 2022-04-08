// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
// function pokemonInfoReducer(state, action) {
function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      // 🐨 replace "pokemon" with "data" (in the action too!)
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

// EC3
function useSafeDispatch(unsafeDispatch) {
  const mountedRef = React.useRef(false)

  React.useLayoutEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const safeDispatch = React.useCallback(
    (...args) => {
      if (mountedRef.current) unsafeDispatch(...args)
    },
    [unsafeDispatch],
  )

  return safeDispatch
}

// Base solution: create custon useAsync hook // , dependencies // base solution
// function useAsync(asyncCallback, initialState) { // EC1
// Extra credit 3: create a safe dispatch that will not dispatch if the component is unmounted
function useAsync(initialState) {
  //EC2

  // 🐨 move all the code between the lines into a new useAsync function.
  // 💰 look below to see how the useAsync hook is supposed to be called
  // 💰 If you want some help, here's the function signature (or delete this
  // comment really quick if you don't want the spoiler)!
  // function useAsync(asyncCallback, dependencies) {/* code in here */}

  // -------------------------- start --------------------------
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  // React.useEffect(() => {
  //   // 💰 this first early-exit bit is a little tricky, so let me give you a hint:
  //   const promise = asyncCallback()
  //   if (!promise) return
  //   // then you can dispatch and handle the promise etc...

  //   dispatch({type: 'pending'})
  //   promise.then(
  //     data => {
  //       dispatch({type: 'resolved', data})
  //     },
  //     error => {
  //       dispatch({type: 'rejected', error})
  //     },
  //   )
  //   // 🐨 you'll accept dependencies as an array and pass that here.
  //   // 🐨 because of limitations with ESLint, you'll need to ignore
  //   // the react-hooks/exhaustive-deps rule. We'll fix this in an extra credit.
  // }, [asyncCallback])
  // --------------------------- end ---------------------------
  // return state

  // EC3
  const safeDispatch = useSafeDispatch(unsafeDispatch)

  // EC2
  const run = React.useCallback(
    promise => {
      safeDispatch({type: 'pending'})
      promise.then(
        data => {
          safeDispatch({type: 'resolved', data})
        },
        error => {
          safeDispatch({type: 'rejected', error})
        },
      )
    },
    [safeDispatch],
  )

  return {...state, run}
}

function PokemonInfo({pokemonName}) {
  // // Extra credit 1: create async callback with React useCallback so the function can be used as a dependency in React useEffect
  // const asyncCallback = React.useCallback(() => {
  //   if (!pokemonName) return
  //   return fetchPokemon(pokemonName)
  // }, [pokemonName])

  // // 🐨 here's how you'll use the new useAsync hook you're writing:
  // const state = useAsync(
  //   asyncCallback,
  //   {status: pokemonName ? 'pending' : 'idle'},
  //   // [pokemonName], // dependencies
  // )

  // // 🐨 this will change from "pokemon" to "data"
  // const {data: pokemon, status, error} = state

  // Extra credit 2: return memoized run function from useAsync hook so creation of memoized callback is abstracted
  const {
    data: pokemon,
    status,
    error,
    run,
  } = useAsync({status: pokemonName ? 'pending' : 'idle'})

  React.useEffect(() => {
    if (!pokemonName) return
    // 💰 note the absence of `await` here. We're literally passing the promise
    // to `run` so `useAsync` can attach it's own `.then` handler on it to keep
    // track of the state of the promise.
    const pokemonPromise = fetchPokemon(pokemonName)
    run(pokemonPromise)
  }, [pokemonName, run])

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
