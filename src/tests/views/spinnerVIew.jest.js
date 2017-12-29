/* eslint-env jest */

import React from "react";
import renderer from "react-test-renderer";

import spinnerRender from "../../application/views/spinnerView";

describe("README header renders correctly", function() {
    it("equals with snapshot", function() {
        expect(
            renderer.create(<spinnerRender/>)
            .toJSON()
        ).toMatchSnapshot();
    });
});
