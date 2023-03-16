export const getToken = (token) => ({
    type: "GET_TOKEN",
    payload: token,
})

export const getUserInfo = (user) => ({
    type: "GET_USER",
    payload: user,
})

export const getCoins = (coins) => ({
    type: "GET_COINS",
    payload: coins
})

export const removeCoin = (name) => ({
    type: "REMOVE_COIN",
    payload: name,
})

export const toggleMode = () => ({
    type: "TOGGLE",
})

