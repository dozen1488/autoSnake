/* eslint-env jest */

import React from "react";
import { configure, shallow } from "enzyme";
import spinnerRender from "../application/views/spinnerView.jsx";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("spinnerRender", function() {
    it("contains spec with an expectation", function() {
        expect(
            shallow(<spinnerRender/>)
                .is(<div className="fulfilling-bouncing-circle-spinner"/>)
        )
            .toBe(false);
    });
});
