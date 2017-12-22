import React from "react";
import PropTypes from "prop-types";

import SellsMeaning from "../sharedConstants/SellsMeanind";

export default class Square extends React.PureComponent {
    render() {
        return (
            <img src={ImageStatus[this.props.status]}
                draggable="false"
                onMouseOver={() => {
                    this.props.actions.onHover(this.props.x, this.props.y);
                }}
                onMouseDown={({ button }) => {
                    this.props.actions.onClick(this.props.x, this.props.y, button);
                }}
                onMouseUp={() => {
                    this.props.actions.onRelease();
                }}
            />
        );
    }
}

Square.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    status: PropTypes.number,
    actions: PropTypes.object,
    stateUpdate: PropTypes.func
};

const ImageStatus = {
    [SellsMeaning.Empty]: require("./images/emptySquare.png"),
    [SellsMeaning.Wall]: require("./images/wallSquare.png"),
    [SellsMeaning.Food]: require("./images/foodSquare.png"),
    [SellsMeaning.SnakeTail]: require("./images/snakeBodySquare.png"),
    [SellsMeaning.SnakeHead]: require("./images/snakeHeadSquare.png")
};
