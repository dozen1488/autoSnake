import React from "react";
import PropTypes from "prop-types";

import * as actions from "../actions/actions";
import store from "../stores/store";

import renderBoard from "../views/boardView";
import renderDeadSnake from "../views/deadSnakeView";
import renderSpinner from "../views/spinnerView";

export default class Board extends React.Component {

    constructor(...args) {
        super(...args);
        store.addListener(this.changedStateHandler.bind(this));
    }

    componentDidUpdate() {
        if (store.getState().toJS().networkReady === STATES.RETRIEVED_NETWORK) {
        //  Preventing context menu from boards
            [...document.getElementsByClassName("Board")]
                .forEach(el =>
                    el.addEventListener("contextmenu", event => {
                        event.preventDefault();

                        return false;
                    })
                );
            delete this.componentDidUpdate;
        }
    }

    changedStateHandler() {
        this.forceUpdate();
    }

    render() {
        const state = store.getState();
        if (state.get("isGameOver")) {
            return renderDeadSnake();
        } else if (state.get("networkReady") == STATES.RETRIEVED_NETWORK) {
            return renderBoard(
                {
                    board: state.get("board"),
                    actions
                }
            );
        } else {
            return renderSpinner();
        }
    }
}

Board.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    radiusOfVisionForNetwork: PropTypes.number
};

const STATES = {
    "WAITING_FOR_NETWORK": false,
    "RETRIEVED_NETWORK": true
};

