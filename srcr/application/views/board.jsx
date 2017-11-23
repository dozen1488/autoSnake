import React from 'react';
import _ from 'lodash';

import SellsMeaning from '../sharedConstants/SellsMeanind.json';
import BoardModel from '../models/board';

export default class Board extends React.Component {

    constructor() {
        super();
        this.state = {
            boardModel: new BoardModel(50, 50)
        }
    }

    renderTable(rows, columns) {
        return new Array(rows).fill(null, 0, rows).map((none, row) => 
            <tr>{
                new Array(columns).fill(null, 0, columns).map((none, column) => {
                    const status = this.state.boardModel.board[column][row];
                    return <td className="Square">
                        <Square status={status} clicked={() => {
                            this.state.walls.push({
                                x: row, y: column
                            });
                            this.setState({});
                        }}/>
                    </td>;
                })
            }</tr>
        );
    }

    render() {
        const table = this.renderTable(50, 50);
        return (
            <table className="Board">
                {table}
            </table>
        );
    }
}

class Square extends React.Component {
    render() {
        return (
            <img src={ImageStatus[this.props.status]} 
                width='10px' 
                height='10px'
                onClick={this.props.clicked}
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