const watchlistReducers = (state, action) => {
    switch(action.type){
        case "GET_TOKEN":
            return{
                ...state,
                token: action.payload,
            }

        case "GET_USER":
            return{
                ...state,
                user: action.payload,
            }    
        
        case "GET_COINS": 
            return{
                ...state,
                coins: [...action.payload],
            }

        case "TOGGLE":
            return{
                ...state,
                darkMode: !state.darkMode,
            }

        default: 
        return state;
    }
}

export default watchlistReducers;