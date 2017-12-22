import { ReduceStore } from "flux/utils";
import _ from "lodash";

import MouseButtons from "../sharedConstants/MouseClickMeaning";
import Dispatcher from "../dispatcher/dispatcher";
import GameManager from "../managers/gameManager";
import * as actions from "../actions/actions";
import { impulseFrequency } from "../sharedConstants/configuration.json";

class Store extends ReduceStore {
    constructor() {
        super(Dispatcher);
    }

    getInitialState() {
        return {};
    }

    reduce(state, action) {
        const actionMap = {
            initStore: () => {
                state = _.merge({
                    x: action.x,
                    y: action.y,
                    radiusOfVisionForNetwork: action.radiusOfVisionForNetwork
                }, _.cloneDeep(defaultStore));
            },
            networkReady: () => {
                state = _.merge({

                    gameManager: new GameManager(
                        actions.changeBoard,
                        actions.gameOver,
                        impulseFrequency,
                        {
                            sizeOfX: state.x,
                            sizeOfY: state.y,
                        }, {
                            network: action.network,
                            radiusOfVisionForNetwork: state.radiusOfVisionForNetwork
                        }
                    )
                }, _.cloneDeep(defaultStore));
                state.networkReady = true;
                this.__emitChange();
            },

            onRelease: () => {
                state.isMouseWallClicked = false;
                state.isMouseFoodClicked = false;

                return state;
            },
            onClick: () => {
                if (action.buttonType === MouseButtons.leftButton) {
                    state.isMouseWallClicked = true;
                } else if (action.buttonType === MouseButtons.rightButton) {
                    state.isMouseFoodClicked = true;
                }
                state.changedSquares = action.changedSquares;

                this.__emitChange();
            },
            onHover: () => {
                state.changedSquares = action.changedSquares;
                this.__emitChange();
            },
            changeBoard: () => {
                state.changedSquares = action.changedSquares;
                this.__emitChange();
            },
            spacePressed: () => {
                state.isPaused = !state.isPaused;
            },

            gameOver: () => {
                state.isGameOver = true;
                this.__emitChange();
            }
        };
        
        if (actionMap[action.type]) {
            actionMap[action.type]();
        }

        return state;
    }
}

const defaultStore = {
    isMouseWallClicked: false,
    isMouseFoodClicked: false,
    isGameOver: false,
    isPaused: false,
    networkReady: false,
    changedSquare: []
};

export default new Store();
