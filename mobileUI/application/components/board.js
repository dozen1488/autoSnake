import _ from "lodash";
import React from "react";
import BoardView from "../views/boardView";
import { Map } from "immutable";

export class Board extends React.PureComponent {
    render() {
        return <BoardView/>;
        // const { isGameOver, networkReady, board, actions } = this.props;
        // if (isGameOver) {
        //     return renderDeadSnake();
        // } else if (networkReady === STATES.RETRIEVED_NETWORK) {
        //     return renderBoard({ board, actions });
        // } else {
        //     return renderSpinner();
        // }
    }
}
