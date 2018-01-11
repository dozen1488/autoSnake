import { fromJS } from "immutable";

import ActionTypes from "../actions/actionTypes";

export default function reduceBoardState(state = fromJS({}), action) {
    switch (action.type) {
        case ActionTypes.initStore:

            return fromJS({
                x: action.x,
                y: action.y,
                radiusOfVisionForNetwork: action.radiusOfVisionForNetwork
            });
        case ActionTypes.onClick:
            return processBoardChange(state, action);
        case ActionTypes.changeBoard:
            return processBoardChange(state, action);
        case ActionTypes.networkReady:

            return fromJS({
                board: action.board
            });
        default:
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
