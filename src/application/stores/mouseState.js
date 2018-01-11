import { Map } from "immutable";

import ActionTypes from "../actions/actionTypes";
import MouseCLicks from "../sharedConstants/MouseClickMeaning.json";

export default function reduceMouseState(state = Map(defaultState), action) {
    switch (action.type) {
        case ActionTypes.onRelease:
            return state.set("isMouseWallClicked", false)
                .set("isMouseFoodClicked", false);
        case ActionTypes.onClick:
            switch (action.buttonType) {
                case MouseCLicks.leftButton:
                    return state.set("isMouseFoodClicked", false)
                        .set("isMouseWallClicked", true);
                case MouseCLicks.rightButton:
                    return state.set("isMouseWallClicked", false)
                        .set("isMouseFoodClicked", true);
            }

            return state;
        default:
            return state;
    }
}

const defaultState = {
    isMouseFoodClicked: false,
    isMouseWallClicked: false
};
