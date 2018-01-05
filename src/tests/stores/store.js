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
        isMouseWallClicked: false,
        isMouseFoodClicked: false,
        isGameOver: false,
        isPaused: false,
        networkReady: false
    };

    it("Properly initialize", () => {

        const stateStandart = _.merge(
            {
                x: sizeX,
                y: sizeY,
                radiusOfVisionForNetwork: radiusOfVisionForNetwork,
            },
            defaultStore
        );

        // action
        Actions.initStore(sizeX, sizeY, radiusOfVisionForNetwork);

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
                board: board,
            }, defaultStore
        );
        stateStandart.networkReady = true;

        // action
        Actions.networkReady(jsonNetwork);

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

        const listener = Store.addListener(() => {
            calltimes++;
            if (!previousBoard) {
                previousBoard = Store.getState().toJS().board;
            } else {
                listener.remove();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                const isStatesEqual = _.isEqual(
                    previousBoard,
                    Store.getState().board
                );
                expect(
                    !isStatesEqual &&
                    (calltimes === 2)
                ).toEqual(true);
                done();
            }
        });
    });

    it("Properly gets changes", () => {
        const testStatus = 23;
        const changedSquares = [{ x: testX, y: testY, state: testStatus }];

        // action
        Actions.changeBoard(changedSquares);

        // check
        const actualStatus = Store.getState().toJS().board[testX][testY];
        expect(actualStatus).toEqual(testStatus);
    });

    it("Properly process clicks and release changes", () => {

        let shouldBeWall, shouldBeFood;

        // action
        Actions.onClick(
            testX, testY, MouseMeanings.leftButton
        );
        Actions.onRelease();
        Actions.onClick(
            testX + 1, testY + 1, MouseMeanings.rightButton
        );
        Actions.onRelease();

        // check
        shouldBeWall = Store.getState().toJS().board[testX][testY] === CellTypes.Wall;
        shouldBeFood = Store.getState().toJS().board[testX + 1][testY + 1] === CellTypes.Food;

        expect(shouldBeWall && shouldBeFood).toEqual(true);
    });

    it("Properly processes pause", () => {
        // action
        Actions.keyPressed("Space");

        // check
        const isPaused = Store.getState().get("isPaused") == true;
        let noImpulses = !Impulser.isImpulsing();

        expect(isPaused && noImpulses).toEqual(true);
    });
});
