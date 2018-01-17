import { fromJS } from "immutable";

import ActionTypes from "../actions/actionTypes";

export default function reduceMouseState(state = fromJS(defaultState), action) {
    switch (action.type) {
        case ActionTypes.onToggle:

            return state.set("toggle", action.value);
        default:
            return state;
    }
}

// false - wall, true - food
const defaultState = {
    toggle: false
};
