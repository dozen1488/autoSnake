import { ReduceStore } from "flux/utils";
import _ from "lodash";
import { fromJS } from "immutable";

import MouseButtons from "../sharedConstants/MouseClickMeaning";
import Dispatcher from "../dispatcher/dispatcher";

class Store extends ReduceStore {
    constructor() {
        super(Dispatcher);
    }

    getInitialState() {
        return {};
    }

    reduce(state, action) {
        const actionMap = {
            initStore: (state, action) => {
                state = _.merge({
                    x: action.x,
                    y: action.y,
                    radiusOfVisionForNetwork: action.radiusOfVisionForNetwork
                }, _.cloneDeep(defaultStore));

                return fromJS(state);
            },
            networkReady: (state, action) => {
                state = _.merge({
                    board: action.board
                }, _.cloneDeep(defaultStore));
                state.networkReady = true;

                return fromJS(state);
            },

            onRelease: (state) => state
                    .set("isMouseWallClicked", false)
                    .set("isMouseFoodClicked", false),

            onClick: (state, action) => {
                if (action.buttonType === MouseButtons.leftButton) {
                    state = state.set("isMouseWallClicked", true);
                } else if (action.buttonType === MouseButtons.rightButton) {
                    state = state.set("isMouseFoodClicked", true);
                }

                return processBoardChange(state, action);
            },
            onHover: processBoardChange,
            changeBoard: processBoardChange,
            spacePressed: (state) => state
                    .set("isPaused", !state.get("isPaused")),

            gameOver: (state) => state
                    .set("isGameOver", true)
        };

        if (actionMap[action.type]) {
            return actionMap[action.type](state, action);
        }

        return state;
    }
}

function processBoardChange(state, action) {
    let board = state.get("board");

    board = updateBoardWIthSquares(board, action.changedSquares);

    return state
        .set("board", board);
}

function updateBoardWIthSquares(immutableBoard, changedSquares) {

    changedSquares.forEach(({ x, y, state: squareState }) => {
        let subList = immutableBoard.get(x);
        subList = subList.set(y, squareState);
        immutableBoard = immutableBoard.set(x, subList);
    });

    return immutableBoard;
}

const defaultStore = {
    isMouseWallClicked: false,
    isMouseFoodClicked: false,
    isGameOver: false,
    isPaused: false,
    networkReady: false
};

export default new Store();
