import createSagaMiddleware from "redux-saga";
import { combineReducers } from "redux-immutablejs";
import { createStore, applyMiddleware } from "redux";

import boardReducer from "./boardState";
import gameReducer from "./gameState";
import mouseReducer from "./mouseState";
import initScript from "../sagas/initScript";

const rootReducer = combineReducers({
    boardState: boardReducer,
    gameState: gameReducer,
    mouseState: mouseReducer
});

const sagaMiddleware = createSagaMiddleware();

const SingletonStore = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(initScript, SingletonStore.dispatch.bind(SingletonStore));

export default SingletonStore;
