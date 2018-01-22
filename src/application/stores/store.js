import "babel-polyfill";

import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux-immutablejs";
import createSagaMiddleware from "redux-saga";

import boardReducer from "./boardState";
import gameReducer from "./gameState";
import mouseReducer from "./mouseState";
import initScript from "../sagas/initScript";

const rootReducer = combineReducers({
    boardState: boardReducer,
    gameState: gameReducer,
    mouseState: mouseReducer
});

export const sagaMiddleware = createSagaMiddleware();

export const Store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(initScript, Store.dispatch.bind(Store));

