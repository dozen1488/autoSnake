/* eslint-env jest */

import React from "react";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJson from "enzyme-to-json";

import SpinnerRender from "../../application/views/spinnerView";

configure({ adapter: new Adapter() });

describe("Spinner renders correctly", function() {
    it("equals with snapshot", function() {
        expect(
            toJson(mount(<SpinnerRender/>))
        ).toMatchSnapshot();
    });
});
