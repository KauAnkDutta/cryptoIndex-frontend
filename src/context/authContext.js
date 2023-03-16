import {createContext, useReducer} from 'react';
import watchlistReducers from './reducers';

const INITIAL_STATE = {
    user: null,
    token: "",
    coins: [],
    darkMode: true,
}

export const userContext = createContext(INITIAL_STATE);

export const ContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(watchlistReducers, INITIAL_STATE)

    return(
        <userContext.Provider value={{
            user: state.user,
            token: state.token,
            coins: state.coins,
            darkMode: state.darkMode,
            dispatch
        }}>
            {children}
        </userContext.Provider>
    )
}