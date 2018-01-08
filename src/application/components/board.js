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
    return { state: state };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: _.mapValues(actions, (mappedAction) => {
            return (...args) => dispatch(mappedAction(...args));
        })
    };
}

class Board extends React.Component {

    componentDidUpdate() {
        if (this.props.state.get("gameState").get("networkReady") === STATES.RETRIEVED_NETWORK) {
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


    render() {
        const { state, actions } = this.props;
        if (state.get("gameState").get("isGameOver")) {
            return renderDeadSnake();
        } else if (state.get("gameState").get("networkReady") == STATES.RETRIEVED_NETWORK) {
            return renderBoard(
                {
                    board: state.get("boardState").get("board"),
                    actions
                }
            );
        } else {
            return renderSpinner();
        }
    }
}

Board.propTypes = {
    state: PropTypes.instanceOf(Map),
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
