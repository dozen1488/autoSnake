import { ReduceStore } from 'flux/utils';

import MouseButtons from '../sharedConstants/MouseClickMeaning';
import { stopImpulse } from '../actions/actions';
import Dispatcher from '../dispatcher/dispatcher';
import actionTypes from '../actions/actionTypes';
import BoardModel from "../models/board";
import { Impulser, Requester } from '../managers/singletoneManagers';

class Store extends ReduceStore {
    constructor() {
        super(Dispatcher);
    }

    getInitialState() {
        return {};
    }

    reduce(state, action) {
        const actionMap = {
            networkReady: () => {
                state ={
                    board: new BoardModel(
                        {
                            sizeOfX: state.x, 
                            sizeOfY: state.y, 
                        }, {
                            network: action.network,
                            radiusOfVisionForNetwork: state.radiusOfVisionForNetwork
                        }
                    ),
                    isMouseClicked: false,
                    isMouseFoodClicked: false,
                    changedSquare: []
                }
            },

            onRelease: () => {
                state.isMouseClicked = false;
                state.isMouseFoodClicked = false; 
            },
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

            impulseBoard: () => {
                const {isGameOver, changedSquares} = state.board.updateState();
                if(!isGameOver) state.changedSquare = changedSquares;
                this.__emitChange();
            },

            initStore: () => {
                state ={
                    x: action.x, 
                    y: action.y, 
                    radiusOfVisionForNetwork: action.radiusOfVisionForNetwork,
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