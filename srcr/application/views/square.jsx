import React from 'react';

import SellsMeaning from '../sharedConstants/SellsMeanind';

export default class Square extends React.Component {
    
    constructor(...args) {
        super(...args);
        this.state = {
            status: this.props.status
        };
        this.props.stateUpdate(this.setState.bind(this));
    }

    render() {
        return (
            <img src={ImageStatus[this.state.status]} 
                draggable='false' 
                onMouseOver={() => {
                    this.props.actions.onHover(this.props.x, this.props.y);
                }}
                onMouseDown={({button}) => {
                    this.props.actions.onClick(this.props.x, this.props.y, button);
                }}
                onMouseUp={() => {
                    this.props.actions.onRelease();
                }}
                width='30px' 
                height='30px'
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