import React from "react";
import PropTypes from "prop-types";

import SellsMeaning from "../sharedConstants/SellsMeanind";

export default function Square(props) {
    return (
        <img src={ImageStatus[props.status]}
            draggable="false"
            onMouseOver={() => {
                props.actions.onHover(props.x, props.y);
            }}
            onMouseDown={({ button }) => {
                props.actions.onClick(props.x, props.y, button);
            }}
            onMouseUp={() => {
                props.actions.onRelease();
            }}
        />
    );
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
