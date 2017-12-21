import React from "react";

import * as actions from "../actions/actions";
import store from "../stores/store";
import render from "../views/boardView";
import deadSnake from "../views/deadSnake";
import spinner from "../views/spinnerView";
import { Requester, Impulser, KeyboardListener } from "../managers/externalManagers";
import PropTypes from "prop-types";

export default class Board extends React.Component {

    constructor(...args) {
        super(...args);

        actions.initStore(
            this.props.x,
            this.props.y,
            this.props.radiusOfVisionForNetwork
        );
        
        Requester.receiveNetwork(actions.networkReady);

        this.squareUpdateFunctions = new Array(this.props.x)
            .fill(null, 0)
            .map(() => new Array(this.props.y));

        this.state = {
            network: STATES.WAITING_FOR_NETWORK,
        };

        let listener = store.addListener(
            () => this.networkReadyHandler(listener)
        );
    }

    componentDidUpdate(prevState) {
        if (
            this.state.network === STATES.RETRIEVED_NETWORK &&
            prevState.network !== STATES.RETRIEVED_NETWORK
        ) {
        //  Preventing context menu from boards
            [...document.getElementsByClassName("Board")]
                .forEach(el =>
                    el.addEventListener("contextmenu", event => {
                        event.preventDefault();

                        return false;
                    })
                );
        }
    }

    networkReadyHandler(listener) {
        listener.remove();
        
        KeyboardListener.startListening(actions.spacePressed);
        const innerListener = store.addListener(
            () => this.changedStateHandler(innerListener)
        );

        Impulser.startImpulsing(actions.changeBoard);

        this.setState({ network: STATES.RETRIEVED_NETWORK });
    }

    changedStateHandler(innerListener) {
        const board = store.getState();
        if (board.isGameOver) {
            Impulser.stopImpulsing();
            Requester.sendImages(board.images);
            innerListener.remove();
            this.forceUpdate();
        }
        if (board.isPaused && Impulser.isImpulsing()) {
            Impulser.stopImpulsing();
        } else if (!board.isPaused && !Impulser.isImpulsing()) {
            Impulser.startImpulsing(actions.changeBoard);
        }
        board.changedSquare.forEach(({ x, y }) => {
            this.squareUpdateFunctions[x][y]({
                status: board.board.board[x][y]
            });
        });
    }

    render() {
        const state = store.getState();
        if (state.isGameOver) {
            return deadSnake();
        } else if (this.state.network == STATES.RETRIEVED_NETWORK) {
            return render(
                this.props.x,
                this.props.y,
                store.getState().board.board,
                this.squareUpdateFunctions,
                actions
            );
        } else {
            return spinner();
        }
    }
}

Board.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    radiusOfVisionForNetwork: PropTypes.number
};

const STATES = {
    "WAITING_FOR_NETWORK": 0,
    "RETRIEVED_NETWORK": 1
};

