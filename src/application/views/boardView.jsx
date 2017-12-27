import "./styles/boardView.css";

import React from "react";
import PropTypes from "prop-types";
import Square from "./squareView";
import renderReadme from "./readmeView";

function renderBoard({ board, actions }) {
    const rows = board.get(0).get("length");

    return (
        <div className="container">
            <table className="board">
                <tbody>
                    {board.map((arr, row) =>
                        (<tr key={row}>
                            {arr.map(
                                (none, column) => {
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


renderBoard.propTypes = {
    rows: PropTypes.number,
    columns: PropTypes.number,
    board: PropTypes.object,
    actions: PropTypes.objectOf(PropTypes.func),
};

export default function render(board, actions) {
    return (
        <div id="root-container">
            <renderReadme/>
            <renderBoard
                board={board}
                actions={actions}
            />
        </div>
    );
}
