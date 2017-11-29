import React from 'react';
import _ from 'lodash';

import {onHover, onClick, onRelease} from '../data/actions';
import store from '../data/store'; 
import SellsMeaning from '../sharedConstants/SellsMeanind';
import BoardModel from '../models/board';

export default class Board extends React.Component {

    constructor(...args) {
        super(...args);
    }

    componentDidMount() {
        store.addListener(
            () => this.forceUpdate()
        )
    }

    renderTable(rows, columns) {
        return new Array(rows)
            .fill(null, 0, rows)
            .map((none, row) => 
                <tr>{
                    new Array(columns)
                        .fill(null, 0, columns)
                        .map((none, column) => {
                            const status = store.getState().board.board[column][row];
                            return <td className="Square">
                                <Square status={status}
                                    x={column} y={row}
                                    dispatcher={this.dispatcher}
                                />
                            </td>;
                        })
                }</tr>
        );
    }

    render() {
        const table = this.renderTable(50, 50);
        return (
            <table className="Board">
                <tbody>     
                    {table}
                </tbody>
            </table>
        );
    }
}

class Square extends React.Component {

    render() {
        return (
            <img src={ImageStatus[this.props.status]} 
                draggable='false' 
                ondragstart="return false;"
                onMouseOver={() => {
                    onHover(this.props.x, this.props.y);
                }}
                onMouseDown={() => {
                    onClick(this.props.x, this.props.y);
                }}
                onMouseUp={() => {
                    onRelease();
                }}
                width='10px' 
                height='10px'
            />
        );
    }
}

const ImageStatus = {
    [SellsMeaning.Empty]: require('./emptySquare.png'),
    [SellsMeaning.Wall]: require('./wallSquare.png'),
    [SellsMeaning.Food]: require('./foodSquare.png'),
    [SellsMeaning.SnakeTail]: require('./snakeBodySquare.png'),
    [SellsMeaning.SnakeHead]: require('./snakeHeadSquare.png')
}