import "./styles/boardView.css";

import Square from "./squareView";
import React from "react";

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
        <div id="rootContainer">
            <div className="Container">
                <p className="ReadmeHeader">
                    Змейка с примитивным AI. Распознаёт окружение вокруг себя в радиусе 1 квадрата.
                    При перезагрузке стреницы отсылает опыт на сервер. 
                    Сервер переобучает сеть и возвращает новую.
                    Следовательно для обновления опыта змейки перезагрузите страницу.
                    Пока что единственный способ сбросить опыт змейки до нуля - это:
                    1) Остановить сервер
                    2) Удалить фаил '/autosnake/server/images.json'
                    3) Запустить сервер
                </p>
                <p className="ReadmeHeader"> &lt; Space &gt; - остановить змейку</p>
                <p className="ReadmeHeader"> &lt; Right Click &gt; - создать стену</p>
                <p className="ReadmeHeader"> &lt; Left Click &gt; - создать пищу</p>
            </div>
            <div className="Container">
                <table className="Board">
                    <tbody>
                        {renderTable(rows, columns, board, squareUpdateFunctions, actions)}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
