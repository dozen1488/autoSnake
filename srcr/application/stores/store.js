import { ReduceStore } from 'flux/utils';

import MouseButtons from '../sharedConstants/MouseClickMeaning';
import { stopImpulse } from '../actions/actions';
import Dispatcher from '../dispatcher/dispatcher';
import actionTypes from '../actions/actionTypes';
import BoardModel from "../models/board";
import pulse from '../managers/pulseGenerator';

class Store extends ReduceStore {
    constructor() {
        super(Dispatcher);
    }

    getInitialState() {
        return {
            board: new BoardModel(2, 2),
            isMouseWallClicked: false,
            isMouseFoodClicked: false,
            changedSquare: []
        };
    }

    reduce(state, action) {
        const actionMap = {
            onClick: () => {
                if(action.buttonType === MouseButtons.leftButton) {
                    state.isMouseClicked = true;
                    state.changedSquare = [
                        state.board.appendWall(action.x, action.y)
                    ];
                } else if(action.buttonType === MouseButtons.rightButton){
                    state.isMouseFoodClicked = true;
                    state.changedSquare = [
                        state.board.appendFood(action.x, action.y)
                    ];
                }
                this.__emitChange();
            },
            onHover: () => {
                if(state.isMouseClicked) {
                    state.changedSquare = [state.board.appendWall(action.x, action.y)];
                    this.__emitChange();
                } else if(state.isMouseFoodClicked) {
                    state.changedSquare = [state.board.appendFood(action.x, action.y)];
                    this.__emitChange();
                }
            },
            onRelease: () => {
                state.isMouseClicked = false;
                state.isMouseFoodClicked = false; 
            },
            impulseBoard: () => {
                state.changedSquare = state.board.updateState();
                this.__emitChange();
            },
            initStore: () => {
                state ={
                    board: new BoardModel(
                        action.x, 
                        action.y, 
                        pulse.stopImpulsing.bind(pulse)
                    ),
                    isMouseClicked: false,
                    isMouseFoodClicked: false,
                    changedSquare: []
                }
            }
        };
        if(actionMap[action.type]){
            actionMap[action.type]();
        }
        return state;
    }
};

export default new Store();