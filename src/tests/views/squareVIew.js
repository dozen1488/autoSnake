/* eslint-env jest */
import _ from "lodash";
import React from "react";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import ImageUrls from "../../application/sharedConstants/ImageUrls";

import Square from "../../application/views/squareView";

configure({ adapter: new Adapter() });

describe("Square renders properly", function() {
    it("has properly src attribute", function() {
        // initialization
        const compareObject = { src: ImageUrls[0] };
        const testProps = { x: 1, y: 2, status: 0 };
        // action
        const actualProps = mount(<Square
                x={testProps.x}
                y={testProps.y}
                status={testProps.status}
            />)
            .find("img")
            .props();
        // check
        expect(actualProps.src).toEqual(compareObject.src);
    });

    it("properly calls all callbacks", function() {
        // initialization
        let hoveredObject = {};
        let clickedObject = {};
        let mouseReleased = false;

        const mockFunctions = {
            onHover: (x, y) => hoveredObject = { x, y },
            onClick: (x, y) => clickedObject = { x, y },
            onRelease: () => mouseReleased = true
        };

        const testProps = { x: 1, y: 2, status: 0 };
        // action
        const renderedSquare = mount(<Square
                x={testProps.x}
                y={testProps.y}
                status={testProps.status}
                actions={mockFunctions}
            />
        );

        renderedSquare.simulate("mouseOver");
        renderedSquare.simulate("mouseDown");
        renderedSquare.simulate("mouseUp");
        // check
        expect(
            _.isEqual(hoveredObject, { x: testProps.x, y: testProps.y }) &&
            _.isEqual(clickedObject, { x: testProps.x, y: testProps.y }) &&
            mouseReleased
        ).toBe(true);
    });
});

