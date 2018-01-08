import { createStore } from "redux";
import { combineReducers } from "redux-immutablejs";

import boardReducer from "./boardState";
import gameReducer from "./gameState";
import mouseReducer from "./mouseState";

const rootReducer = combineReducers({
    boardState: boardReducer,
    gameState: gameReducer,
    mouseState: mouseReducer
});

export default createStore(rootReducer);
