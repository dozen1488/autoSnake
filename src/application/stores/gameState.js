import { fromJS } from "immutable";

import ActionTypes from "../actions/actionTypes";

export default function reduceGameState(state = fromJS(defaultState), action) {
    switch (action.type) {
        case ActionTypes.gameOver:
            return state.set("isGameOver", true);
        case ActionTypes.spacePressed:
            return state.set("isPaused", !state.get("isPaused"));
        case ActionTypes.networkReady:
            return state.set("networkReady", true);
        default:
            return state;
    }
}

const defaultState = {
    isGameOver: false,
    isPaused: false,
    networkReady: false
};
