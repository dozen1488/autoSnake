import { ReduceStore } from 'flux/utils';
import _ from 'lodash';

import MouseButtons from '../sharedConstants/MouseClickMeaning';
import { stopImpulse } from '../actions/actions';
import Dispatcher from '../dispatcher/dispatcher';
import actionTypes from '../actions/actionTypes';
import {BoardModel} from "../../../crossPlatformModels/boardModel";

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
                state = _.merge({
                    board: new BoardModel(
                        {
                            sizeOfX: state.x, 
                            sizeOfY: state.y, 
                        }, {
                            network: action.network,
                            radiusOfVisionForNetwork: state.radiusOfVisionForNetwork
                        }
                    )
                }, _.cloneDeep(dafaultStore));
                this.__emitChange();
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
                const {isGameOver, changedSquares, images} = state.board.updateState();
                if(!isGameOver) {
                    state.changedSquare = changedSquares;
                }else {
                    state.images = images;
                    state.isGameOver = isGameOver;
                }
                this.__emitChange();
            },

            initStore: () => {
                state = _.merge({
                    x: action.x, 
                    y: action.y, 
                    radiusOfVisionForNetwork: action.radiusOfVisionForNetwork
                }, _.cloneDeep(dafaultStore));
            },

            keyPressed: () => {
                if(action.key === "Space"){
                    state.isPaused = !state.isPaused;
                }
                this.__emitChange();
            }
        };
        
        if(actionMap[action.type]){
            actionMap[action.type]();
        }
        return state;
    }
};

const dafaultStore = {
    isMouseClicked: false,
    isMouseFoodClicked: false,
    isGameOver: false,
    isPaused: false,
    changedSquare: []
}

export default new Store();