/* eslint-env jest */

import React from "react";
import renderer from "react-test-renderer";

import readmeRender from "../../application/views/readmeView";

describe("README header renders correctly", function() {
    it("equals with snapshot", function() {
        expect(
            renderer.create(<readmeRender/>)
            .toJSON()
        ).toMatchSnapshot();
    });
});
