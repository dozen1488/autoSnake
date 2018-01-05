/* eslint-env jest */
import React from "react";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { fromJS } from "immutable";

import CellTypes from "../../../crossPlatformModels/CellTypes";

import BoardRender from "../../application/views/boardView";
import Square from "../../application/views/squareView";

configure({ adapter: new Adapter() });

describe("Board renders correctly", function() {
    it("properly passes board state to square properties", function() {
        // initialization
        const sizeOfX = 50;
        const sizeOfY = 50;

        const boardData = fromJS(
            new Array(sizeOfX)
                .fill(0)
                .map(
                () => new Array(sizeOfY)
                    .fill(CellTypes.Empty)
                    .map(() => Math.round(Math.random() * 5))
                )
        );

        // action
        const boardResult = mount(<BoardRender
            board={boardData}
        />);

        // check
        const trBlocks = boardResult
            .find("tr");

        const isAllOk = trBlocks
            .map((wrapper, trIndex) => wrapper
                .find(Square)
                .map((wrapper, tdIndex) => {
                    const { x, y, status } = wrapper.props();

                    return (
                        x === tdIndex &&
                        y === (trBlocks.length - trIndex - 1) &&
                        status === boardData.get(x).get(y)
                    );
                })
            )
            .reduce((isAllOK, currentArray) => currentArray
                .reduce((prev, curr) => prev && curr, true)
            , true
            );

        expect(isAllOk).toEqual(true);
    });
});
