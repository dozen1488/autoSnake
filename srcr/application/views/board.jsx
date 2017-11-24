import React from 'react';
import _ from 'lodash';
import Dispatcher from '../dispatchers/BoardDispatcher';

import SellsMeaning from '../sharedConstants/SellsMeanind.json';
import BoardModel from '../models/board';

const AppDispatcher = new Dispatcher(); 
window.AppDispatcher = AppDispatcher;

export default class Board extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            boardModel: new BoardModel(50, 50)
        }
    }

    toggleMouse() {
        this.mousePushed = !this.mousePushed;
    }

    renderTable(rows, columns) {
        return new Array(rows).fill(null, 0, rows).map((none, row) => 
            <tr>{
                new Array(columns).fill(null, 0, columns).map((none, column) => {
                    const status = this.state.boardModel.board[column][row];
                    return <td className="Square">
                        <Square status={status}
                            x={column} y={row}
                        />
                    </td>;
                })
            }</tr>
        );
    }

    render() {
        const table = this.renderTable(50, 50);
        return (
            <table className="Board"
                onClick={() => this.toggleMouse()}>
                {table}
            </table>
        );
    }
}

class Square extends React.Component {

    constructor(...args) {
        super(...args);
    }

    onClick(){
        AppDispatcher.dispatch({
            eventName: 'onClick',
            x: this.props.x,
            y: this.props.y
        });
    }

    onMouseOver(){
        AppDispatcher.dispatch({
            eventName: 'onMouseOver',
            x: this.props.x,
            y: this.props.y
        });
    }

    render() {
        return (
            <img src={ImageStatus[this.props.status]} 
                onMouseOver={() => {this.onMouseOver}}
                onClick={() => {this.onClick}}
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