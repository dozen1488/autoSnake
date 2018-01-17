import _ from "lodash";
import React from "react";
import { List } from "immutable";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";

import RootComponent from "../views/boardView";
import * as actions from "../actions/actions";
import DeadSnakeComponent from "../views/deadSnakeView";

function mapStateToProps(state) {
    return {
        toggleState: state.get("toggleState").get("toggle"),
        gameState: {
            isGameOver: state.get("gameState").get("isGameOver"),
            networkReady: state.get("gameState").get("networkReady"),
            isPaused: state.get("gameState").get("isPaused")
        },
        board: state.get("boardState").get("board")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: _.mapValues(actions, (mappedAction) => {
            return (...args) => dispatch(mappedAction(...args));
        })
    };
}

class Board extends React.PureComponent {
    render() {
        const { gameState, board, actions, toggleState } = this.props;
        const { networkReady, isGameOver } = gameState;
        if (isGameOver) {
            return <DeadSnakeComponent/>;
        } else if (networkReady === STATES.RETRIEVED_NETWORK) {
            return <RootComponent
                toggleState={toggleState}
                gameState={gameState}
                board={board}
                actions={actions}
            />;
        } else {
            return <View/>;
        }
    }
}

Board.propTypes = {
    gameState: PropTypes.object,
    board: PropTypes.instanceOf(List),
    actions: PropTypes.objectOf(PropTypes.func)
};

const STATES = {
    "WAITING_FOR_NETWORK": false,
    "RETRIEVED_NETWORK": true
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);
