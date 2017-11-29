import { ReduceStore } from 'flux/utils';

import Dispatcher from './dispatcher';
import actionTypes from './actionTypes';
import BoardModel from "../models/board";

class Store extends ReduceStore {
    constructor() {
        super(Dispatcher);
    }

    getInitialState() {
        return {
            board: new BoardModel(50, 50),
            isMouseClicked: false
        };
    }

    reduce(state, action) {
        const actionMap = {
            onClick(){
                state.isMouseClicked = true;
            },
            onHover(){
                if(state.isMouseClicked) {
                    state.board.appendWall(action.x, action.y);
                }
            },
            onRelease(){
                state.isMouseClicked = false;
            }
        };
        if(actionMap[action.type]){
            actionMap[action.type]();
            this.__emitChange();
        }
        return state;
    }
};

export default new Store();