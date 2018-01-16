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
        isGameOver: state.get("gameState").get("isGameOver"),
        networkReady: state.get("gameState").get("networkReady"),
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
        const { isGameOver, networkReady, board, actions } = this.props;
        if (networkReady === STATES.RETRIEVED_NETWORK) {
            return <RootComponent board={board} actions={actions}/>;
        } else if (isGameOver) {
            return <DeadSnakeComponent/>;
        } else {
            return <View/>;
        }
    }
}

Board.propTypes = {
    isGameOver: PropTypes.bool,
    networkReady: PropTypes.bool,
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
