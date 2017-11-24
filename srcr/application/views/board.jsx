import React from 'react';
import _ from 'lodash';
import {Dispatcher} from 'flux';

import SellsMeaning from '../sharedConstants/SellsMeanind.json';
import BoardModel from '../models/board';

export default class Board extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            boardModel: new BoardModel(50, 50)
        }
        this.dispatcher = new Dispatcher();
        this.dispatcher.register((eventData) => {
            switch(eventData.eventName){
                case 'onMouseOver':
                    if(this.mousePushed) {
                        eventData.emmiter.setState({
                            status: SellsMeaning.Wall
                        });
                    }
                    break;
                case 'onClick':
                    this.mousePushed = !this.mousePushed;
                    break;
            }
        });

    }

    renderTable(rows, columns) {
        return new Array(rows).fill(null, 0, rows).map((none, row) => 
            <tr>{
                new Array(columns).fill(null, 0, columns).map((none, column) => {
                    const status = this.state.boardModel.board[column][row];
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
                {table}
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
    }

    onClick(){
        this.props.dispatcher.dispatch({
            eventName: 'onClick',
            x: this.props.x,
            y: this.props.y,
            emmiter: this
        });
    }

    onMouseOver(){
        this.props.dispatcher.dispatch({
            eventName: 'onMouseOver',
            x: this.props.x,
            y: this.props.y,
            emmiter: this
        });
    }

    render() {
        return (
            <img src={ImageStatus[this.state.status]} 
                onMouseOver={() => {this.onMouseOver()}}
                onClick={() => {this.onClick()}}
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