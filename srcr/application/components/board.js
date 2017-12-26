import React from "react";
import PropTypes from "prop-types";

import * as actions from "../actions/actions";
import store from "../stores/store";

import render from "../views/boardView";
import deadSnake from "../views/deadSnake";
import spinner from "../views/spinnerView";

import { Requester, Impulser, KeyboardListener } from "../managers/externalManagers";

export default class Board extends React.Component {

    constructor(...args) {
        super(...args);

        actions.initStore(
            this.props.x,
            this.props.y,
            this.props.radiusOfVisionForNetwork
        );
        
        Requester.receiveNetwork(actions.networkReady);

        let listener = store.addListener(
            () => this.networkReadyHandler(listener)
        );
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
        }
    }

    networkReadyHandler(listener) {
        listener.remove();
        
        KeyboardListener.startListening(actions.keyPressed);
        const innerListener = store.addListener(
            () => this.changedStateHandler(innerListener)
        );
        this.forceUpdate();
    }

    changedStateHandler(innerListener) {
        const isGameOver = store.getState().get("isGameOver");
        if (isGameOver) {
            innerListener.remove();
        }
        this.forceUpdate();
    }

    render() {
        const state = store.getState();
        if (state.get("isGameOver")) {
            return deadSnake();
        } else if (state.get("networkReady") == STATES.RETRIEVED_NETWORK) {
            return render(
                this.props.x,
                this.props.y,
                state.get("board"),
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
    "WAITING_FOR_NETWORK": false,
    "RETRIEVED_NETWORK": true
};

