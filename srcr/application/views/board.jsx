import React from 'react';
import _ from 'lodash';

import {onHover, onClick, onRelease, initStore} from '../actions/actions';
import store from '../stores/store'; 
import SellsMeaning from '../sharedConstants/SellsMeanind';
import BoardModel from '../models/board';

export default class Board extends React.Component {

    constructor(...args) {
        super(...args);
        initStore(this.props.x, this.props.y);
        this.squareRefs = new Array(this.props.x)
            .fill(null, 0)
            .map(() => new Array(this.props.y));
    }

    componentDidMount() {
        store.addListener(
            () => {
                const board = store.getState();
                board.changedSquare.forEach( ({x, y}) => {
                    this.squareRefs[x][y]({
                        status: board.board.board[x][y]
                    });
                });
            }
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
                                <Square 
                                    status={status}
                                    x={column} 
                                    y={row}
                                    callback={(func) => {
                                        this.squareRefs[column][row] = func;
                                    }}
                                />
                            </td>;
                        })
                }</tr>
        );
    }

    render() {
        const table = this.renderTable(this.props.x, this.props.y);
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

    constructor(...args) {
        super(...args);
        this.state = {
            status: this.props.status
        };
        this.props.callback(this.setState.bind(this));
    }

    render() {
        return (
            <img src={ImageStatus[this.state.status]} 
                draggable='false' 
                onMouseOver={() => {
                    onHover(this.props.x, this.props.y);
                }}
                onMouseDown={({button}) => {
                    onClick(this.props.x, this.props.y, button);
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