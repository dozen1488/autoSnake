import Square from './square';
import React from 'react';

function renderTable(rows, columns, board, squareUpdateFunctions, actions) {
    return new Array(rows)
        .fill(null, 0, rows)
        .map((none, row) => 
            <tr>{
                new Array(columns)
                    .fill(null, 0, columns)
                    .map((none, column) => {
                        const status = board[column][rows - row - 1];
                        return <td className="Square">
                            <Square 
                                status={status}
                                x={column} 
                                y={rows - row - 1}
                                stateUpdate={(func) => {
                                    squareUpdateFunctions[column][rows - row - 1] = func;
                                }}
                                actions={actions}
                            />
                        </td>;
                    })
            }</tr>
    );
}

export default function render(rows, columns, board, squareUpdateFunctions, actions) {
    return (
        <table className="Board">
            <tbody>     
                {renderTable(rows, columns, board, squareUpdateFunctions, actions)}
            </tbody>
        </table>
    );
}
