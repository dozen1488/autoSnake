import "./styles/boardView.css";

import React from "react";
import PropTypes from "prop-types";
import Square from "./squareView";
import RenderReadme from "./readmeView";

function RenderBoard({ board, actions }) {
    const rows = board.get(0).size;

    return (
        <div className="container">
            <table className="board">
                <tbody>
                    {board.map((arr, row) =>
                        (<tr key={row}>
                            {arr.map((none, column) => {
                                    const status = board.get(column).get(rows - row - 1);

                                    return (
                                        <td key={column} className="square">
                                            <Square
                                                status={status}
                                                x={column}
                                                y={rows - row - 1}
                                                actions={actions}
                                            />
                                        </td>
                                    );
                                })
                            }
                        </tr>)
                    )}
                </tbody>
            </table>
        </div>
    );
}


RenderBoard.propTypes = {
    rows: PropTypes.number,
    columns: PropTypes.number,
    board: PropTypes.object,
    actions: PropTypes.objectOf(PropTypes.func),
};

export default function render({ board, actions }) {
    return (
        <div id="root-container">
            <RenderReadme/>
            <RenderBoard
                board={board}
                actions={actions}
            />
        </div>
    );
}

render.propTypes = {
    board: PropTypes.array,
    actions: PropTypes.object
};
