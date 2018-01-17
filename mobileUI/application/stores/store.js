import createSagaMiddleware from "redux-saga";
import { combineReducers } from "redux-immutablejs";
import { createStore, applyMiddleware } from "redux";

import boardReducer from "./boardState";
import gameReducer from "./gameState";
import toggleReducer from "./toggleState";
import initScript from "../sagas/initScript";

const rootReducer = combineReducers({
    boardState: boardReducer,
    gameState: gameReducer,
    toggleState: toggleReducer
});

const sagaMiddleware = createSagaMiddleware();

const SingletonStore = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(initScript, SingletonStore.dispatch.bind(SingletonStore));

export default SingletonStore;
