/* eslint-env jasmine */
// initialization
import _ from "lodash";

import { BoardModel, CellTypes } from "../../../crossPlatformModels/boardModel";
import MouseMeanings from "../../application/sharedConstants/MouseClickMeaning";
import Impulser from "../../application/managers/impulser";

import Store from "../../application/stores/store";
import * as Actions from "../../application/actions/actions";
import generateNetwork from "../../../crossPlatformModels/generateNetwork";

describe("Tests for store + dispatcher + action", () => {

    const sizeX = 40;
    const sizeY = 40;
    const testX = 2;
    const testY = 3;
    const radiusOfVisionForNetwork = 1;

    const defaultStore = {
        mouseState: {
            isMouseWallClicked: false,
            isMouseFoodClicked: false
        },
        gameState: {
            isGameOver: false,
            isPaused: false,
            networkReady: false
        }
    };

    it("Properly initialize", () => {

        const stateStandart = _.merge(
            {
                boardState: {
                    x: sizeX,
                    y: sizeY,
                    radiusOfVisionForNetwork: radiusOfVisionForNetwork,
                }
            },
            defaultStore
        );

        // action
        Store.dispatch(Actions.initStore(sizeX, sizeY, radiusOfVisionForNetwork));

        // check
        const actualState = Store.getState().toJS();

        expect(actualState).toEqual(stateStandart);
    });

    it("Properly retrieve network", () => {

        const jsonNetwork = generateNetwork(radiusOfVisionForNetwork).toJSON();
        const boardStandart = new BoardModel(
            {
                sizeOfX: sizeX,
                sizeOfY: sizeY
            }, {
                network: jsonNetwork,
                radiusOfVisionForNetwork: radiusOfVisionForNetwork
            }
        );
        const board = boardStandart.board;

        const stateStandart = _.merge(
            {
                boardState: { board },
            }, defaultStore
        );
        stateStandart.gameState.networkReady = true;

        // action
        Store.dispatch(Actions.networkReady(jsonNetwork));

        // check
        const actualState = Store.getState().toJS();

        expect(actualState).toEqual(stateStandart);
    });

    it("Properly emits changes", (done) => {
        // check
        let calltimes = 0;

        let previousBoard;

        const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

        const listener = Store.subscribe(() => {
            calltimes++;
            if (!previousBoard) {
                previousBoard = Store.getState().get("boardState").toJS();
            } else {
                listener();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                const isStatesEqual = _.isEqual(
                    previousBoard,
                    Store.getState().get("boardState").toJS()
                );

                expect(isStatesEqual).toEqual(false);
                expect(calltimes).toEqual(2);
                done();
            }
        });
    });

    it("Properly gets changes", () => {
        const testStatus = 23;
        const changedSquares = [{ x: testX, y: testY, state: testStatus }];

        // action
        Store.dispatch(Actions.changeBoard(changedSquares));

        // check
        const actualStatus = Store.getState().get("boardState").toJS().board[testX][testY];

        expect(actualStatus).toEqual(testStatus);
    });

    it("Properly process clicks and release changes", () => {
        // action
        Store.dispatch(Actions.onClick(testX, testY, MouseMeanings.leftButton));
        Store.dispatch(Actions.onHover(testX + 1, testY + 1));
        Store.dispatch(Actions.onRelease());
        Store.dispatch(Actions.onClick(testX + 2, testY + 2, MouseMeanings.rightButton));
        Store.dispatch(Actions.onHover(testX + 3, testY + 3));
        Store.dispatch(Actions.onRelease());

        // check
        const board = Store.getState().get("boardState").toJS().board;

        expect(board[testX][testY]).toEqual(CellTypes.Wall);
        expect(board[testX + 1][testY + 1]).toEqual(CellTypes.Wall);
        expect(board[testX + 2][testY + 2]).toEqual(CellTypes.Food);
        expect(board[testX + 3][testY + 3]).toEqual(CellTypes.Food);
    });

    it("Properly processes pause", () => {
        // action
        Store.dispatch(Actions.keyPressed("Space"));

        // check
        expect(Store.getState().get("gameState").get("isPaused")).toEqual(true);
        expect(Impulser.isImpulsing()).toEqual(false);
    });
});
