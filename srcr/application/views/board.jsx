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
                        const status = board[column][rows - row];
                        return <td className="Square">
                            <Square 
                                status={status}
                                x={column} 
                                y={row}
                                stateUpdate={(func) => {
                                    squareUpdateFunctions[column][row] = func;
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
