# Advanced React Hooks

## 01: useReducer
When managing an independent element of state using a stand alone state and state setter is advantageous  
When one element of state relies on another element of state for updating using a reducer function is advantageous  
Input to reducer function  
1. state: the current state
2. action: value that that is passed to the updater function (dispatch function), alternately whatever is passed to the dispatch function will be th second argument to the reducer function  

Input to useReducer hook  
1. reducer function
2. initial state value
3. optional: initializer function (lazy compute initial state)

## 02: useCallback 
Memoization is a performance optimization technique which eliminates the need to recompute an output for a previously provided input. This is done by storing input(s) and its corresponding output in storage and checking provided inputs against the storage and returning the matching output for matching inputs if it exists  
The purpose of useMemo and useCallback is to memoize values and functions in dependency list and props on memoized components   

## 03: useContext
