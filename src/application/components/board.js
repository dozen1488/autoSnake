import _ from "lodash";
import React from "react";
import { Map } from "immutable";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import renderBoard from "../views/boardView";
import * as actions from "../actions/actions";
import renderSpinner from "../views/spinnerView";
import renderDeadSnake from "../views/deadSnakeView";

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
        if (isGameOver) {
            return renderDeadSnake();
        } else if (networkReady === STATES.RETRIEVED_NETWORK) {
            return renderBoard({ board, actions });
        } else {
            return renderSpinner();
        }
    }
}

Board.propTypes = {
    isGameOver: PropTypes.bool,
    networkReady: PropTypes.bool,
    board: PropTypes.instanceOf(Map),
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
