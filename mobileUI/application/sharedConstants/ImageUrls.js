/* eslint-env node */

import CellTypes from "../../../crossPlatformModels/CellTypes";

export default {
    [CellTypes.Empty]: require("../views/images/emptySquare.png"),
    [CellTypes.Wall]: require("../views/images/wallSquare.png"),
    [CellTypes.Food]: require("../views/images/foodSquare.png"),
    [CellTypes.SnakeTail]: require("../views/images/snakeBodySquare.png"),
    [CellTypes.SnakeHead]: require("../views/images/snakeHeadSquare.png")
};
