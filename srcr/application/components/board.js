import React from 'react';

import * as actions from '../actions/actions';
import store from '../stores/store'; 
import render from '../views/board';
import spinner from "../views/spinner";
import {Requester, Impulser} from '../managers/singletoneManagers'; 

export default class Board extends React.Component {

    constructor(...args) {
        super(...args);

        actions.initStore(
            this.props.x, 
            this.props.y,
            this.props.radiusOfVisionForNetwork
        );

        document.addEventListener('contextmenu', event => { 
            event.preventDefault();
            return false;
        });

        Requester.receiveNetwork(actions.networkReady);

        this.squareUpdateFunctions = new Array(this.props.x)
            .fill(null, 0)
            .map(() => new Array(this.props.y));

        this.state = {
            network: STATES.WAITING_FOR_NETWORK
        };

        let listener = store.addListener(() => {
            listener.remove();
            store.addListener(
                () => {
                    const board = store.getState();
                    board.changedSquare.forEach( ({x, y}) => {
                        this.squareUpdateFunctions[x][y]({
                            status: board.board.board[x][y]
                        });
                    });
                }
            );

            Impulser.startImpulsing(actions.impulseBoard);

            this.setState({network: STATES.RETRIEVED_NETWORK});
        });
    }

    render() {
        return (this.state.network == STATES.RETRIEVED_NETWORK) ? 
            render(
                this.props.x,
                this.props.y,
                store.getState().board.board,
                this.squareUpdateFunctions,
                actions
            ) :
            spinner();
    }
}

const STATES = {
    "WAITING_FOR_NETWORK": 0,
    "RETRIEVED_NETWORK": 1
}