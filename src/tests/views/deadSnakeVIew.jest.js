/* eslint-env jest */

import React from "react";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJson from "enzyme-to-json";

import DeadSnakeRender from "../../application/views/deadSnakeView";

configure({ adapter: new Adapter() });

describe("Dead snake renders correctly", function() {
    it("equals with snapshot", function() {
        expect(
            toJson(mount(<DeadSnakeRender/>))
        ).toMatchSnapshot();
    });
});
